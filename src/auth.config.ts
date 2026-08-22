import type { NextAuthConfig } from 'next-auth';

// v4 fell back to the NEXTAUTH_SECRET env var when `secret` was unset; v5 only
// reads AUTH_SECRET, so resolve the chain ourselves to keep existing setups working
const secret = process.env.SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

// edge-safe base config (no prisma) shared by the proxy and src/auth.ts
const authConfig = {
	providers: [],
	trustHost: true,
	secret,
	session: { strategy: 'jwt' },
	pages: {
		signIn: '/signin',
		error: '/signin',
	},
	// keep the v4 cookie names so sessions survive the upgrade;
	// the __Secure- prefix must follow the URL scheme (like v4), not NODE_ENV
	cookies: {
		sessionToken: {
			name: `${process.env.NEXTAUTH_URL?.startsWith('https://') ? '__Secure-' : ''}next-auth.session-token`,
		},
	},
	callbacks: {
		async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
			return url.startsWith(baseUrl) ? url : baseUrl;
		},
		async jwt({ token, user }: { token: any; user?: any }) {
			if (user) {
				token.id = user.id;
				token.username = user.username;
				token.permissions = user.permissions;
			}

			return token;
		},
		async session({ session, token }: { session: any; token: any }) {
			session.user = {
				...session.user,
				id: token.id as string,
				username: token.username as string,
				permissions: token.permissions as Record<string, boolean>,
			};

			return session;
		},
	},
} satisfies NextAuthConfig;

export default authConfig;
