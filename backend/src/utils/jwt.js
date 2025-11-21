import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const {
JWT_ACCESS_SECRET,
JWT_REFRESH_SECRET,
ACCESS_TOKEN_TTL_MIN = 1,
REFRESH_TOKEN_TTL_DAYS = 30,
} = process.env;

export const signAccessToken = (user) => {
    const payload = {
        sub: user._id.toString(),
        role: user.role,
    }
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: `${ACCESS_TOKEN_TTL_MIN}m` });
}

export const signRefreshToken = (user) => {
    const payload = {
        sub: user._id.toString()
    };
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d` });
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_ACCESS_SECRET);
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}