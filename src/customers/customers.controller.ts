import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UpdateCustomerDTO } from 'src/types/DTO/UpdateCustomerDTO';
import { CreateCustomerDTO } from 'src/types/DTO/CreateCustomerDTO';

@Controller('customers')
export class CustomersController {
  constructor(private customerService: CustomersService) {}

  @Get('/:userId')
  getAllCustomersForUser(
    @Param('userId') userId: string,
    @Query('page') page: number | 1,
    @Query('q') q: string,
  ) {
    return this.customerService.getAllCustomersForUser(userId, page, q);
  }

  @Get('/:customerId/:userId')
  getCustomerById(
    @Param('customerId') customerId: string,
    @Param('userId') userId: string,
  ) {
    return this.customerService.getCustomerById(customerId, userId);
  }

  @Delete('/:customerId/:userId')
  deleteCustomeryId(
    @Param('customerId') customerId: string,
    @Param('userId') userId: string,
  ) {
    return this.customerService.deleteCustomerById(customerId, userId);
  }

  @Put()
  updateCutomer(@Body() updateCustomerDTO: UpdateCustomerDTO) {
    return this.customerService.updateCustomer(updateCustomerDTO);
  }

  @Post()
  createCustomer(@Body() createCustomerDTO: CreateCustomerDTO) {
    return this.customerService.createCustomer(createCustomerDTO);
  }
}
