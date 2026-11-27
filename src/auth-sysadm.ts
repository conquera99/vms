import type { BetterAuthPlugin } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { setSessionCookie } from 'better-auth/cookies';
import dayjs from 'dayjs';

import { prisma } from './db';
import { placeholderEmail, SYSADM_ID } from './utils/account';

/**
 * Hardcoded `sysadm` login (password: today's MMDD). Anything else falls through
 * to the regular username sign-in.
 */
export const sysadm = () =>
	({
		id: 'sysadm',
		hooks: {
			before: [
				{
					matcher: (context) => context.path === '/sign-in/username',
					handler: createAuthMiddleware(async (ctx) => {
						const { username, password } = ctx.body ?? {};

						if (username !== SYSADM_ID || password !== dayjs().format('MMDD')) return;

						// sessions are stored in the database and need a user row to point at
						const user = await prisma.user.upsert({
							where: { id: SYSADM_ID },
							update: {},
							create: {
								id: SYSADM_ID,
								name: 'System Administrator',
								email: placeholderEmail(SYSADM_ID),
								createdBy: SYSADM_ID,
							},
						});

						const session = await ctx.context.internalAdapter.createSession(user.id);

						if (!session) throw new APIError('INTERNAL_SERVER_ERROR');

						await setSessionCookie(ctx, { session, user });

						return ctx.json({ token: session.token });
					}),
				},
			],
		},
	}) satisfies BetterAuthPlugin;
