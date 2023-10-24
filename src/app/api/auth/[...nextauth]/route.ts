import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";
import { signJwtTokens } from "@/libs/jwt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter all required fields");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid Credentials");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!passwordMatch) {
          throw new Error("Invalid Credentials");
        }

        const { hashedPassword, ...userNoPass } = user;
        const accessToken = signJwtTokens(
          userNoPass,
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "1h" }
        );
        const refreshToken = signJwtTokens(
          userNoPass,
          process.env.JWT_REFRESH_KEY as string,
          { expiresIn: "7d" }
        );
        const result = {
          ...userNoPass,
          accessToken,
          refreshToken,
        };

        return result;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
