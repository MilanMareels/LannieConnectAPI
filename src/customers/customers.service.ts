import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { Customer } from 'src/types/Customer';
import { CreateCustomerDTO } from 'src/types/DTO/CreateCustomerDTO';
import { UpdateCustomerDTO } from 'src/types/DTO/UpdateCustomerDTO';
import { RetrunObjectCustomers } from 'src/types/ReturnObjectCursomers';
import { User } from 'src/types/User';
import { v7 as uuidv7 } from 'uuid';

const itemsPerPage: number = 10;
const uri: string = process.env.MONGODB_URI!;
const database: string = 'LannieConnect'; // Naar .env file!
const client = new MongoClient(uri);

@Injectable()
export class CustomersService {
  async getAllCustomersForUser(userId: string, page: number) {
    await this.doesUserExist(userId);
    const customers: RetrunObjectCustomers =
      await this.queryAllCustomersForUser(userId, page);
    if (customers.customers.length === 0)
      throw new NotFoundException('Je hebt nog geen customers!');
    return customers;
  }

  async getCustomerById(customerId: string, userId: string) {
    await this.doesUserExist(userId);
    const customer: Customer = await this.queryCustomersById(
      customerId,
      userId,
    );
    if (!customer) throw new NotFoundException('Customer not found!');
    return customer;
  }

  async deleteCustomerById(customerId: string, userId: string) {
    await this.getCustomerById(customerId, userId);
    await this.queryDeleteCustomersById(customerId, userId);
    return { succes: true, message: 'Customer verwijdert!' };
  }

  async updateCustomer(updateCustomerDTO: UpdateCustomerDTO) {
    await this.getCustomerById(
      updateCustomerDTO.customerId,
      updateCustomerDTO.userId,
    );
    return await this.queryUpdateCustomersById(updateCustomerDTO);
  }

  async createCustomer(createCustomerDTO: CreateCustomerDTO) {
    await this.checkIfCustomerAlreadyExists(
      createCustomerDTO.companyName,
      createCustomerDTO.email,
      createCustomerDTO.phone,
    );
    const newCustomer: Customer = {
      userId: createCustomerDTO.userId,
      customerId: uuidv7(),
      companyName: createCustomerDTO.companyName,
      name: createCustomerDTO.name,
      email: createCustomerDTO.email,
      phone: createCustomerDTO.phone,
      address: createCustomerDTO.address,
      status: 'nog bellen',
      image: createCustomerDTO.image,
      website: createCustomerDTO.website,
      notes: createCustomerDTO.notes,
    };
    return await this.queryAddCustomer(newCustomer);
  }

  //Helpers
  async checkIfCustomerAlreadyExists(
    companyName: string,
    email: string,
    phone: string,
  ) {
    const customer = await this.queryCustomerByInfo(companyName, email, phone);
    if (customer !== null)
      throw new ConflictException('Deze klant bestaat al!');
  }

  // Checks
  doesUserExist = async (userId: string) => {
    const user = await this.queryUserByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
  };

  // DataBase
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

  queryAddCustomer = async (newCustomer: Customer) => {
    try {
      return await client
        .db(database)
        .collection('Customers')
        .insertOne(newCustomer);
    } catch (error) {
      return error;
    }
  };

  queryAllCustomersForUser = async (userId: string, page: number) => {
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

  queryCustomersById = async (customerId: string, userId: string) => {
    try {
      return await client.db(database).collection('Customers').findOne({
        customerId: customerId,
        userId: userId,
      });
    } catch (error) {
      return error;
    }
  };

  queryCustomerByInfo = async (
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

  queryDeleteCustomersById = async (customerId: string, userId: string) => {
    try {
      return await client.db(database).collection('Customers').deleteOne({
        customerId: customerId,
        userId: userId,
      });
    } catch (error) {
      return error;
    }
  };

  queryUpdateCustomersById = async (updateCustomerDTO: UpdateCustomerDTO) => {
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
}
