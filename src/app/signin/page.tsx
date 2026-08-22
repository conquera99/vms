import { Suspense } from 'react';
import type { Metadata } from 'next';

import SignInForm from './sign-in-form';

export const metadata: Metadata = {
	title: 'Masuk',
	robots: {
		index: false,
		follow: false,
	},
};

export default function SignInPage() {
	return (
		<Suspense fallback={null}>
			<SignInForm />
		</Suspense>
	);
}
