import { MongoClient } from 'mongodb';

import 'dotenv/config';
import { User } from 'src/types/User';

const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

export const queryAddUser = async (newUser: User) => {
  try {
    await client.db(database).collection('Users').insertOne(newUser);
  } catch (error) {
    return error;
  }
};
