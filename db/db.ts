// importing PrismaClient
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return 
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// exporting the variable
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
