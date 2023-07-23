import { Prisma } from '@prisma/client';

const userWithRoles = Prisma.validator<Prisma.UserArgs>()({
  include: {
    roles: true,
  },
});

export type UserWithRoles = Prisma.UserGetPayload<typeof userWithRoles>;
