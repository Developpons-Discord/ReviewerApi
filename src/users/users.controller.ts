import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('all')
  @Roles('admin')
  getAllUsers() {
    return this.usersService.findAll();
  }
}
