import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOptions {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOptions = {
  expiresIn: "1h",
};

export function signJwtTokens(
  payload: JwtPayload,
  key: string,
  options: SignOptions
) {
  console.log("signing access token******************");
  const jwt_token = jwt.sign(payload, key, options);
  return jwt_token;
}

export function verifyJwt(token: string) {
  console.log("verify token ******************");
  try {
    const decoded_jwt = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded_jwt as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
