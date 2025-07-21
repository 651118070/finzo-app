
import { PrismaClient } from '@prisma/client';

// Declare global scope extension
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create or use existing PrismaClient instance
const prisma = global.prisma || new PrismaClient();

// Save prisma instance to global to prevent multiple instances
global.prisma = prisma;

export default prisma;