import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { Response, NextFunction, Request } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing');
  }

  // 0 = Bearer 1323f123f12423gb52
  const [, token] = authHeader.split(' ');

  try {
    const decodedtoken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedtoken as ITokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token');
  }
}
