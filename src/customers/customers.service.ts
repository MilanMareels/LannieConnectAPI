import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { doesUserExist } from 'src/common/common';
import { queryAddCustomer } from 'src/database/Customers/queryAddCustomer';
import { queryAllCustomersForUser } from 'src/database/Customers/queryAllCustomersForUser';
import { queryCustomersById } from 'src/database/Customers/queryCustomerById';
import { queryCustomerByInfo } from 'src/database/Customers/queryCustomerByInfo';
import { queryDeleteCustomersById } from 'src/database/Customers/queryDeleteCustomerById';
import { queryUpdateCustomersById } from 'src/database/Customers/queryUpdateCustomerById';
import { Customer } from 'src/types/Customer';
import { CreateCustomerDTO } from 'src/types/DTO/CreateCustomerDTO';
import { UpdateCustomerDTO } from 'src/types/DTO/UpdateCustomerDTO';
import { RetrunObjectCustomers } from 'src/types/ReturnObjectCursomers';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class CustomersService {
  async getAllCustomersForUser(userId: string, page: number) {
    await doesUserExist(userId);
    const customers: RetrunObjectCustomers = await queryAllCustomersForUser(
      userId,
      page,
    );
    if (customers.customers.length === 0)
      throw new NotFoundException('Je hebt nog geen customers!');
    return customers;
  }

  async getCustomerById(customerId: string, userId: string) {
    await doesUserExist(userId);
    const customer: Customer = await queryCustomersById(customerId, userId);
    if (!customer) throw new NotFoundException('Customer not found!');
    return customer;
  }

  async deleteCustomerById(customerId: string, userId: string) {
    await this.getCustomerById(customerId, userId);
    await queryDeleteCustomersById(customerId, userId);
    return { succes: true, message: 'Customer verwijdert!' };
  }

  async updateCustomer(updateCustomerDTO: UpdateCustomerDTO) {
    await this.getCustomerById(
      updateCustomerDTO.customerId,
      updateCustomerDTO.userId,
    );
    return await queryUpdateCustomersById(updateCustomerDTO);
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
    return await queryAddCustomer(newCustomer);
  }

  //Helpers
  async checkIfCustomerAlreadyExists(
    companyName: string,
    email: string,
    phone: string,
  ) {
    const customer = await queryCustomerByInfo(companyName, email, phone);
    if (customer !== null)
      throw new ConflictException('Deze klant bestaat al!');
  }
}
