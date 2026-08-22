import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../generated/client/client';

declare global {
	// allow global `var` declarations
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		adapter: new PrismaMariaDb(process.env.DATABASE_URL ?? ''),
		log: ['query'],
		errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
	});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
