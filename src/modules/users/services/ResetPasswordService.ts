import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { isAfter, addHours } from 'date-fns';
import { UserRepository } from '../typeorm/repositories/UsersRepository';
import { UserTokensRepository } from './../typeorm/repositories/UserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

export default class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UserRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const userToken = await userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User Token does not exist.');
    }

    const user = await usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exist.');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    user.password = await hash(password, 8);
  }
}