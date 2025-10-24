import { User } from "../users/user.schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateAuthToken = (user: User): string => {
  if (!config.jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(user, config.jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyAuthToken = (token: string): User | null => {
  if (!config.jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.verify(token, config.jwtSecret) as User;
  } catch (error) {
    return null;
  }
};

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  console.log("isProduction", isProduction);
  return {
    httpOnly: true,
    secure: isProduction, // true in production, false in dev
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    ...(isProduction && { domain: process.env.COOKIE_DOMAIN }), // Only set domain in production if needed
  };
};
