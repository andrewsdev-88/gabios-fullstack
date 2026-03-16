import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = global as unknown as { prisma: PrismaClientSingleton };

export const db =
  globalForPrisma.prisma ??
  (() => {
    const client = prismaClientSingleton();

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }

    return client;
  })();

// Prevent multiple instantiations in hot reload (development)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
