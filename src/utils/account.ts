export const SYSADM_ID = 'sysadm';

// better-auth requires a unique email per user, but email is optional here
const PLACEHOLDER_DOMAIN = '@no-email.invalid';

export const placeholderEmail = (userId: string) => `${userId}${PLACEHOLDER_DOMAIN}`;

export const publicEmail = (email?: string | null) =>
	!email || email.endsWith(PLACEHOLDER_DOMAIN) ? null : email;
