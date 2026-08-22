import type { Metadata } from 'next';

import Profile from './view';

export const metadata: Metadata = {
	title: { absolute: 'VMS: Profile' },
};

export default function ProfilePage() {
	return <Profile />;
}
