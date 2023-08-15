import { Prisma } from '@prisma/client';

const fullUser = Prisma.validator<Prisma.UserArgs>()({
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

export type FullUser = Prisma.UserGetPayload<typeof fullUser>;
