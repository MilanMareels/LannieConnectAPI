import { ConflictException, NotFoundException } from '@nestjs/common';
import { queryGetUserByEmail } from 'src/database/Users/queryUserByEmail';
import { queryUserByUserId } from 'src/database/Users/queryuserByUserId';
import { User } from 'src/types/User';

export const doesUserExist = async (userId: string) => {
  const user = await queryUserByUserId(userId);
  if (!user) {
    throw new NotFoundException('User not found!');
  }
};

export const doesUserAlreadyExist = async (email: string): Promise<void> => {
  const foundUser: User = (await queryGetUserByEmail(email)) as User;
  if (foundUser !== null) throw new ConflictException('User bestaat al!');
};
