import { Prisma } from '@prisma/client';

const userWithRoles = Prisma.validator<Prisma.UserArgs>()({
  include: {
    roles: true,
  },
});

export type UserWithRoles = Prisma.UserGetPayload<typeof userWithRoles>;

const userWithConfirmaiton = Prisma.validator<Prisma.UserArgs>()({
  include: {
    accountVerification: {
      include: {
        emailConfirmation: true,
      },
    },
  },
});

export type UserWithConfirmation = Prisma.UserGetPayload<
  typeof userWithConfirmaiton
>;
