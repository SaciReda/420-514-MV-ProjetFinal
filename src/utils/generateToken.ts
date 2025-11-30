import * as jwt from 'jsonwebtoken';

const secret: jwt.Secret = process.env.JWT_SECRET || 'fallback_secret';

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, secret) as string | jwt.JwtPayload;
};