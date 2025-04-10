import { MongoClient } from 'mongodb';

import 'dotenv/config';
import { User } from 'src/types/User';

const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

export const queryUserByUserId = async (
  userId: string,
): Promise<User | unknown> => {
  try {
    return await client
      .db(database)
      .collection('Users')
      .findOne({ userId: userId });
  } catch (error) {
    return error;
  }
};
