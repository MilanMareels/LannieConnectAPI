import { MongoClient } from 'mongodb';

const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

export const queryCustomersById = async (
  customerId: string,
  userId: string,
) => {
  try {
    return await client.db(database).collection('Customers').findOne({
      customerId: customerId,
      userId: userId,
    });
  } catch (error) {
    return error;
  }
};
