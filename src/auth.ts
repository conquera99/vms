import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { customSession, username } from 'better-auth/plugins';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';

import { sysadm } from './auth-sysadm';
import { prisma } from './db';
import { publicEmail, SYSADM_ID } from './utils/account';

const getPermissions = async (userId: string) => {
	const rows =
		userId === SYSADM_ID
			? await prisma.permissions.findMany()
			: await prisma.userPermissions.findMany({ where: { userId } });

	return Object.fromEntries(rows.map((row) => [row.name, true])) as Record<string, boolean>;
};

export const auth = betterAuth({
	// the NEXTAUTH_* fallbacks keep existing deployments' env vars working
	secret: process.env.BETTER_AUTH_SECRET || process.env.SECRET || process.env.NEXTAUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL,
	database: prismaAdapter(prisma, { provider: 'mysql' }),
	session: { expiresIn: 60 * 60 * 24 * 30 },
	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
		// existing password hashes are bcrypt
		password: {
			hash: (password) => bcrypt.hash(password, 10),
			verify: ({ hash, password }) => bcrypt.compare(password, hash),
		},
	},
	// users are managed from /admin/user only
	disabledPaths: [
		'/sign-up/email',
		'/sign-in/email',
		'/is-username-available',
		'/update-user',
		'/change-email',
		'/change-password',
		'/delete-user',
	],
	plugins: [
		username({
			displayUsername: false,
			usernameNormalization: false,
			usernameValidator: () => true,
			minUsernameLength: 1,
			maxUsernameLength: 25,
		}),
		sysadm(),
		customSession(async ({ user, session }) => {
			const { username: loginName } = user as typeof user & { username?: string | null };

			return {
				session,
				user: {
					...user,
					username: user.id === SYSADM_ID ? SYSADM_ID : loginName,
					email: publicEmail(user.email),
					permissions: await getPermissions(user.id),
				},
			};
		}),
		// must stay last
		nextCookies(),
	],
});

export const getSession = async () => auth.api.getSession({ headers: await headers() });
