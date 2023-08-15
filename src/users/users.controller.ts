import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('all')
  @Roles('admin')
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users.map((user) =>
      this.usersService.toDto(user, ['email', 'createdAt', 'updatedAt']),
    );
  }
}
