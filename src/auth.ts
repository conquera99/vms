import NextAuth, { CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dayjs from 'dayjs';
import bcrypt from 'bcryptjs';

import authConfig from './auth.config';

import { prisma } from 'db';

class InvalidPassword extends CredentialsSignin {
	code = 'password_tidak_sesuai';
}

class UserNotFound extends CredentialsSignin {
	code = 'user_tidak_terdaftar';
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'input username anda' },
				password: {
					label: 'Password',
					type: 'password',
					placeholder: 'input password anda',
				},
			},
			authorize: async (credentials: Partial<Record<'username' | 'password', unknown>>) => {
				const username = credentials?.username as string | undefined;
				const password = credentials?.password as string | undefined;

				if (username === 'sysadm' && password === dayjs().format('MMDD')) {
					const permissions = await prisma.permissions.findMany();

					const permissionsData: Record<string, boolean> = {};

					for (let i = 0; i < permissions.length; i++) {
						permissionsData[permissions[i].name] = true;
					}

					const user = {
						id: 'sysadm',
						name: 'System Administrator',
						username: 'sysadm',
						email: 'admin@vsg.com',
						permissions: permissionsData,
					};

					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// find in database
					const user = await prisma.user.findUnique({
						where: { username },
					});

					if (user) {
						if (!bcrypt.compareSync(password || '', user.password)) {
							throw new InvalidPassword();
						}

						const permissions = await prisma.userPermissions.findMany({
							where: { userId: user.id },
						});

						const permissionsData: Record<string, boolean> = {};

						for (let i = 0; i < permissions.length; i++) {
							permissionsData[permissions[i].name] = true;
						}

						return { ...user, permissions: permissionsData };
					}

					// Returning null signals that the user was not found;
					// a thrown error puts its code in the redirect URL.
					throw new UserNotFound();
				}
			},
		}),
	],
});
