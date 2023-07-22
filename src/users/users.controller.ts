import { Controller, Get } from '@nestjs/common';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get('all')
  getAllUsers() {
    return this.usersService.findAll();
  }
}
