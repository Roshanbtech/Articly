import { hashPassword, comparePassword } from "../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import * as userRepo from "../repositories/user.repo.js";

const COOKIE_SECURE = (process.env.COOKIE_SECURE === "true");
const COOKIE_SAMESITE = process.env.COOKIE_SAMESITE || "strict";

const refreshCookieOpts = {
  httpOnly: true,
  secure: COOKIE_SECURE,
  sameSite: COOKIE_SAMESITE,
  path: "/api/auth/refresh",
};

export const register = async (payload) => {
  const { firstName, lastName, email, phone, dob, password, preferences } = payload;

  const exists = await userRepo.findByEmailOrPhone(email, phone);
  if (exists) throw { status: 400, message: "User is already registered" };

  const passwordHash = await hashPassword(password);
  const user = await userRepo.createUser({
    firstName,
    lastName,
    email,
    phone,
    dob: dob ? new Date(dob) : undefined,
    passwordHash,
    role: "user",
    preferences: preferences || [],
  });

  return user; 
};

export const login = async ({ identifier, password }) => {
  const user = await userRepo.findByIdentifier(identifier);
  if (!user) throw { status: 401, message: "Invalid credentials" };

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw { status: 401, message: "Invalid credentials" };

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return { user, accessToken, refreshToken };
};

export const refresh = async (token) => {
  const decoded = verifyRefreshToken(token);
  const user = await userRepo.findById(decoded.sub);
  if (!user) throw { status: 401, message: "Invalid refresh token" };

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return { user, accessToken, refreshToken };
};

export const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, refreshCookieOpts);
};

export const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", { ...refreshCookieOpts, maxAge: 0 });
};
