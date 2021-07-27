import { Prisma } from '@prisma/client';

export const chatWithMessages = Prisma.validator<Prisma.ChatArgs>()({
  include: {
    messages: {
      include: { sender: { include: { avatar: true } }, receiver: { include: { avatar: true } } },
    },
  },
});

export type ChatWithMessagesModel = Prisma.ChatGetPayload<typeof chatWithMessages>;
