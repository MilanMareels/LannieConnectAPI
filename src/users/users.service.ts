import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO } from 'src/types/DTO/LoginDTO';
import { User } from 'src/types/User';
import { v7 as uuidv7 } from 'uuid';
import { RegisterDTO } from 'src/types/DTO/RegisterDTO';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

@Injectable()
export class UsersService {
  salt: number = 12;

  // Services
  async login(loginDTO: LoginDTO) {
    const user: User = (await this.queryGetUserByEmail(loginDTO.email)) as User;
    await this.doesUserExist(user.userId);
    await this.comparePassword(loginDTO.password, user.password);
    return {
      user: user,
      succes: true,
    };
  }

  async register(registerDTO: RegisterDTO) {
    await this.doesUserAlreadyExist(registerDTO.email);
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
    await this.queryAddUser(newUser);
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

  // Checks
  doesUserAlreadyExist = async (email: string): Promise<void> => {
    const foundUser: User = (await this.queryGetUserByEmail(email)) as User;
    if (foundUser !== null) throw new ConflictException('User bestaat al!');
  };

  doesUserExist = async (userId: string) => {
    const user = await this.queryUserByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
  };

  // DataBase
  queryAddUser = async (newUser: User) => {
    try {
      await client.db(database).collection('Users').insertOne(newUser);
    } catch (error) {
      return error;
    }
  };

  queryGetUserByEmail = async (email: string): Promise<User | unknown> => {
    try {
      return await client
        .db(database)
        .collection('Users')
        .findOne({ email: email });
    } catch (error) {
      return error;
    }
  };

  queryUserByUserId = async (userId: string): Promise<User | unknown> => {
    try {
      return await client
        .db(database)
        .collection('Users')
        .findOne({ userId: userId });
    } catch (error) {
      return error;
    }
  };
}
