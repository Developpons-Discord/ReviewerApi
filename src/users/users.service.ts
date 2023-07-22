import { Injectable } from '@nestjs/common';
import { Role } from '../roles/role.enum';

export interface User {
  userId: number;
  username: string;
  password: string;
  roles: Role[];
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'redstom',
      password: 'test',
      roles: [Role.Admin, Role.User],
    },
    {
      userId: 2,
      username: 'john',
      password: 'guess',
      roles: [Role.User],
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }
}
