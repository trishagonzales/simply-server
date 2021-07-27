import { Prisma } from '@prisma/client';

const userWithAvatar = Prisma.validator<Prisma.UserArgs>()({ include: { avatar: true } });
export type UserWithAvatar = Prisma.UserGetPayload<typeof userWithAvatar>;
