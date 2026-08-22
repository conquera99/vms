import NextAuth from 'next-auth';

import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { pathname } = req.nextUrl;
	const isLoggedIn = Boolean(req.auth);

	if (!isLoggedIn && (pathname.startsWith('/admin') || pathname.startsWith('/profile'))) {
		return Response.redirect(new URL('/signin', req.nextUrl));
	}

	if (isLoggedIn && pathname === '/signin') {
		return Response.redirect(new URL('/', req.nextUrl));
	}
});

export const config = {
	matcher: ['/admin/:path*', '/profile', '/signin'],
};
