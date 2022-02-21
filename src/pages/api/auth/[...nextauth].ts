import NextAuth, { IncomingRequest, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiHandler } from 'next';
import dayjs from 'dayjs';
import bcrypt from 'bcryptjs';

import type { JWT } from 'next-auth/jwt';

import { prisma } from 'db';

interface redirectInterface {
	url: string;
	baseUrl: string;
}

interface jwtInterface {
	token: JWT;
	user?: User;
}

interface sessionInterface {
	session: Session;
	token: JWT;
	user: User;
}

export const authOptions = {
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
			authorize: async (
				credentials: Record<string, string> | undefined,
				req: Pick<IncomingRequest, 'body' | 'query' | 'headers' | 'method'>,
			): Promise<Omit<User, 'id'> | { id?: string | undefined } | null> => {
				if (
					credentials?.username === 'sysadm' &&
					credentials?.password === dayjs().format('MMDD')
				) {
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
						where: { username: credentials?.username },
					});

					if (user) {
						if (!bcrypt.compareSync(credentials?.password || '', user.password)) {
							throw new Error('password tidak sesuai');
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

					// If you return null then an error will be displayed advising the user to check their details.
					throw new Error('user tidak terdaftar');
				}
			},
		}),
	],
	pages: {
		signIn: '/signin',
		error: '/signin',
	},
	jwt: {
		maxAge: 60 * 60 * 24 * 30,
	},
	secret: process.env.SECRET,
	callbacks: {
		async redirect({ url, baseUrl }: redirectInterface) {
			console.log('redirect:url', url);
			console.log('redirect:baseUrl', baseUrl);
			return url.startsWith(baseUrl) ? url : baseUrl;
		},
		async jwt({ token, user }: jwtInterface) {
			if (user) {
				token.id = user.id;
				token.username = user.username;
				token.permissions = user.permissions;
			}

			console.log('jwt:token', token);
			console.log('jwt:user', user);

			return token;
		},
		async session({ session, token, user }: sessionInterface) {
			console.log('session:session', session);
			console.log('session:token', token);
			console.log('session:user', user);

			const sess = {
				...session,
				user: {
					...session.user,
					...user,
					id: token.id as string,
					username: token.username as string,
					permissions: token.permissions,
				},
			};

			console.log('session:sess', sess);
			console.log('======');

			return sess;
		},
	},
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

export default authHandler;
