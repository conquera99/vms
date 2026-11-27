import { NextRequest, NextResponse } from 'next/server';

import { auth } from './auth';

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	// check the stored session, not just the cookie, so a stale cookie can't lock out /signin
	const isLoggedIn = Boolean(await auth.api.getSession({ headers: request.headers }));

	if (!isLoggedIn && (pathname.startsWith('/admin') || pathname.startsWith('/profile'))) {
		return NextResponse.redirect(new URL('/signin', request.url));
	}

	if (isLoggedIn && pathname === '/signin') {
		return NextResponse.redirect(new URL('/', request.url));
	}
}

export const config = {
	matcher: ['/admin/:path*', '/profile', '/signin'],
};
