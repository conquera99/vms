import NextAuth, { Awaitable, IncomingRequest, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiHandler } from 'next';

import type { JWT } from 'next-auth/jwt';

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
			authorize: function (
				credentials: Record<string, string> | undefined,
				req: Pick<IncomingRequest, 'body' | 'query' | 'headers' | 'method'>,
			): Awaitable<Omit<User, 'id'> | { id?: string | undefined } | null> {
				console.log('signin...');
				console.log('credentials', credentials);
				console.log('req', req);

				const user = { id: 1, name: 'Admin', email: 'admin@vsg.com' };

				if (user) {
					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null;

					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			},
		}),
	],
	pages: {
		signIn: '/signin',
	},
	jwt: {
		maxAge: 60 * 60 * 24 * 30,
	},
	secret: process.env.SECRET,
	callbacks: {
		async redirect({ url, baseUrl }: redirectInterface) {
			console.log('redirect', url, baseUrl);
			return url.startsWith(baseUrl) ? url : baseUrl;
		},
		async jwt({ token, user }: jwtInterface) {
			if (user) {
				token.id = user.id;
			}

			console.log('jwt', token, user);

			return token;
		},
		async session({ session, user }: sessionInterface) {
			const sess = {
				...session,
				user: {
					...session.user,
					...user,
				},
			};

			console.log('session', session, user, sess);

			return sess;
		},
	},
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

export default authHandler;
