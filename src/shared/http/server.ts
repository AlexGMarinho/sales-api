import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import { routes } from './routes';
import AppError from '../errors/AppError';
import '@shared/typeorm';
import uploadConfig from '@config/upload';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.director));
app.use(routes);

app.use(errors());

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  next();

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3000, () => {
  console.log('Server startd on http://localhost:3000 🏆');
});
