"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthButton = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div>
      {session && session.user ? (
        <div className="flex items-center gap-2">
          <p>{session.user.name}</p>
          <button className="btn btn-primary" onClick={() => signOut()}>
            LogOut
          </button>
        </div>
      ) : (
        <>
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/auth/login")}
          >
            LogIn
          </button>
        </>
      )}
    </div>
  );
};

export default AuthButton;
