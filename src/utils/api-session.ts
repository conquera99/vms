import type { NextApiRequest } from 'next';
import { decode } from 'next-auth/jwt';

interface ApiSessionUser {
	id: string;
	name?: string | null;
	email?: string | null;
	username?: string;
	permissions?: Record<string, boolean>;
}

interface ApiSession {
	user: ApiSessionUser;
	expires: string;
}

/**
 * Temporary bridge for pages-router API routes until they are converted to
 * app-router route handlers (migration phase 2). Reads and decrypts the
 * session cookie the same way `getSession({ req })` did in next-auth v4.
 */
export async function getApiSession(req: NextApiRequest): Promise<ApiSession | null> {
	const secret = process.env.SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? '';
	if (!secret) return null;

	const cookieNames = [
		'next-auth.session-token',
		'__Secure-next-auth.session-token',
		'authjs.session-token',
		'__Secure-authjs.session-token',
	];

	for (const name of cookieNames) {
		const token = req.cookies[name];
		if (!token) continue;

		const jwt = await decode({ token, salt: name, secret });

		if (jwt) {
			return {
				user: {
					id: jwt.id as string,
					name: jwt.name,
					email: jwt.email,
					username: jwt.username,
					permissions: jwt.permissions,
				},
				expires: new Date((jwt.exp ?? 0) * 1000).toISOString(),
			};
		}
	}

	return null;
}
