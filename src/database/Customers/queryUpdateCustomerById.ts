import { MongoClient } from 'mongodb';
import { UpdateCustomerDTO } from 'src/types/DTO/UpdateCustomerDTO';

const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

export const queryUpdateCustomersById = async (
  updateCustomerDTO: UpdateCustomerDTO,
) => {
  try {
    return await client.db(database).collection('Customers').updateOne(
      {
        customerId: updateCustomerDTO.customerId,
        userId: updateCustomerDTO.userId,
      },
      { $set: updateCustomerDTO },
    );
  } catch (error) {
    return error;
  }
};
