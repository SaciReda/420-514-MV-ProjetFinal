import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/generateToken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'acces refusé. token manquant.',
    });
  }

  try {
    const decoded: any = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide ou expiré.',
    });
  }
};