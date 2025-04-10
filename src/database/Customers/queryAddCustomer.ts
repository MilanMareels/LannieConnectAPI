import { MongoClient } from 'mongodb';
import { Customer } from 'src/types/Customer';

const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

export const queryAddCustomer = async (newCustomer: Customer) => {
  try {
    return await client
      .db(database)
      .collection('Customers')
      .insertOne(newCustomer);
  } catch (error) {
    return error;
  }
};
