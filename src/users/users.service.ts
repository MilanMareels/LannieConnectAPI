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
    this.checkPassword(loginDTO.password, user.password);
    return {
      user: user,
      succes: true,
    };
  }

  async register(registerDTO: RegisterDTO) {
    await doesUserAlreadyExist(registerDTO.email);
    const hashPassword: string = this.hashPassword(registerDTO.password);
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
  checkPassword = (password: string, hash: string) => {
    const match: boolean = compareSync(password, hash);
    if (!match) throw new UnauthorizedException('Fout wachtwoord!');
  };

  hashPassword = (password: string) => {
    return hashSync(password, this.salt);
  };
}
