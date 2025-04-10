import { MongoClient } from 'mongodb';

const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

export const queryCustomerByInfo = async (
  companyName: string,
  email: string,
  phone: string,
) => {
  try {
    return await client.db(database).collection('Customers').findOne({
      companyName: companyName,
      email: email,
      phone: phone,
    });
  } catch (error) {
    return error;
  }
};
