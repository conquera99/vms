import { SessionProvider } from 'next-auth/react';

import 'styles/globals.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session} refetchInterval={5 * 60}>
			<Component {...pageProps} />
		</SessionProvider>
	);
}
export default MyApp;
