import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserWithRoles } from './user.model';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findWhere({
    where,
  }: {
    where: Prisma.UserWhereInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      where,
    });
  }

  async findOne({
    where,
  }: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where,
      include: {
        roles: true,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(
    data: Prisma.UserCreateInput,
  ): Promise<Omit<UserWithRoles, 'password'>> {
    try {
      const { password, ...user } = await this.prisma.user.create({
        data,
        include: {
          roles: true,
        },
      });
      return user;
    } catch {
      throw new ConflictException(
        "Un utilisateur avec ce nom d'utilisateur ou cet email existe déjà.",
      );
    }
  }

  async update({
    where,
    data,
  }: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.prisma.user.update({
      data,
      where,
    });
  }
}
