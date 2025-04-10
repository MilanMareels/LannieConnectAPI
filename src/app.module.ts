import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { CustomersController } from './customers/customers.controller';
import { CustomersService } from './customers/customers.service';
import { UserModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [UserModule, CustomersModule],
  controllers: [AppController, UsersController, CustomersController],
  providers: [AppService, UsersService, CustomersService],
})
export class AppModule {}
