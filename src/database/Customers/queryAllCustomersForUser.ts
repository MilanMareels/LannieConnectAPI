import { MongoClient } from 'mongodb';

import 'dotenv/config';
import { RetrunObjectCustomers } from 'src/types/ReturnObjectCursomers';
import { Customer } from 'src/types/Customer';

const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

let itemsPerPage: number = 10;

export const queryAllCustomersForUser = async (
  userId: string,
  page: number,
) => {
  try {
    const customers = (await client
      .db(database)
      .collection('Customers')
      .find({ userId: userId })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage + 1)
      .project({
        customerId: 1,
        userId: 1,
        companyName: 1,
        status: 1,
        image: 1,
        _id: 1,
      })
      .toArray()) as Customer[];

    const nextPage: boolean = customers.length > itemsPerPage;

    if (nextPage) customers.pop();

    const returnObject: RetrunObjectCustomers = {
      nextPage,
      customers,
    };

    return returnObject;
  } catch (error) {
    return error;
  }
};
