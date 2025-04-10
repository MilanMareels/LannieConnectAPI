import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt-ts';
import { LoginDTO } from 'src/types/DTO/LoginDTO';
import { User } from 'src/types/User';
import { v7 as uuidv7 } from 'uuid';
import { queryGetUserByEmail } from 'src/database/Users/queryUserByEmail';
import { doesUserAlreadyExist, doesUserExist } from 'src/common/common';
import { RegisterDTO } from 'src/types/DTO/RegisterDTO';
import { queryAddUser } from 'src/database/Users/queryAddUser';

@Injectable()
export class UsersService {
  salt: number = 12;

  // Services
  async login(loginDTO: LoginDTO) {
    const user: User = (await queryGetUserByEmail(loginDTO.email)) as User;
    await doesUserExist(user.userId);
    this.comparePassword(loginDTO.password, user.password);
    return {
      user: user,
      succes: true,
    };
  }

  async register(registerDTO: RegisterDTO) {
    await doesUserAlreadyExist(registerDTO.email);
    const hashPassword: string = await this.hashPassword(registerDTO.password);
    const newUser: User = {
      userId: uuidv7(),
      firstname: registerDTO.firstname,
      lastname: registerDTO.lastname,
      companyName: registerDTO.companyName,
      companyNumber: registerDTO.companyNumber,
      email: registerDTO.email,
      password: hashPassword,
    };
    await queryAddUser(newUser);
    return { user: newUser, succes: true };
  }

  // Helpers
  comparePassword = async (password: string, hash: string) => {
    const { compareSync } = await import('bcrypt-ts');
    const match: boolean = compareSync(password, hash);
    if (!match) throw new UnauthorizedException('Fout wachtwoord!');
  };

  hashPassword = async (password: string) => {
    const { hashSync } = await import('bcrypt-ts');
    return hashSync(password, 12);
  };
}
