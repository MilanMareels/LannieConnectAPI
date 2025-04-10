import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from 'src/types/DTO/LoginDTO';
import { RegisterDTO } from 'src/types/DTO/RegisterDTO';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/login')
  login(@Body() loginDTO: LoginDTO) {
    return this.userService.login(loginDTO);
  }

  @Post('/register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.userService.register(registerDTO);
  }
}
