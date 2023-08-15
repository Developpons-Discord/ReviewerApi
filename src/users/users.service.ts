import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { FullUser } from './user.model';
import { UserDto, UserDtoIgnorableFields } from './user.dto';

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

  async findById(userId: number): Promise<FullUser | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: true,
        accountVerification: {
          include: {
            emailConfirmation: true,
          },
        },
        resetPassword: true,
      },
    });
  }

  async findByUsername(username: string): Promise<FullUser | null> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        roles: true,
        accountVerification: {
          include: {
            emailConfirmation: true,
          },
        },
        resetPassword: true,
      },
    });
  }

  async findByEmail(email: string): Promise<FullUser | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: true,
        accountVerification: {
          include: {
            emailConfirmation: true,
          },
        },
        resetPassword: true,
      },
    });
  }

  async findAll(): Promise<FullUser[]> {
    return this.prisma.user.findMany({
      include: {
        roles: true,
        accountVerification: {
          include: {
            emailConfirmation: true,
          },
        },
        resetPassword: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prisma.user.create({
        data,
        include: {
          roles: true,
          accountVerification: {
            include: {
              emailConfirmation: true,
            },
          },
          resetPassword: true,
        },
      });
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

  toDto(user: FullUser, ignoredFields: UserDtoIgnorableFields = []): UserDto {
    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: 'roles' in user ? user.roles.map((role) => role.name) : [],
      verified:
        'accountVerification' in user
          ? !!user.accountVerification?.verified
          : false,
    };
    ignoredFields.forEach((field) => delete userDto[field]);
    return userDto;
  }
}
