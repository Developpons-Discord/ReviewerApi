import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserWithConfirmation, UserWithRoles } from './user.model';

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
    include,
  }: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
  }) {
    return this.prisma.user.findUnique({
      where,
      include: {
        ...include,
        roles: true,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(
    data: Prisma.UserCreateInput,
  ): Promise<Omit<UserWithRoles & UserWithConfirmation, 'password'>> {
    try {
      const { password, ...user } = await this.prisma.user.create({
        data,
        include: {
          roles: true,
          accountVerification: {
            include: {
              emailConfirmation: true,
            },
          },
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

  async delete(userId: number) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async verify(userId: number) {
    const userUpdate = await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        accountVerification: {
          update: {
            verified: true,
          },
        },
      },
      include: {
        accountVerification: {
          include: {
            emailConfirmation: true,
          },
        },
      },
    });

    const emailDelete = await this.prisma.accountVerification.update({
      where: {
        id: userUpdate.accountVerification?.id,
      },
      data: {
        emailConfirmation: {
          delete: true,
        },
      },
    });

    return { userUpdate, emailDelete };
  }
}
