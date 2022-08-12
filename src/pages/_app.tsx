import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';

import 'styles/globals.css';
import 'styles/rc-select.css';
import 'styles/rc-picker.css';
import 'styles/rc-dialog.css';
import 'styles/rc-input-number.css';
import 'styles/rc-tooltip.css';
import 'styles/toastify.css';

import type { AppProps } from 'next/app';
import { pageview } from 'utils/ga';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			pageview(url);
		};

		//When the component is mounted, subscribe to router changes
		//and log those page views
		router.events.on('routeChangeComplete', handleRouteChange);

		// If the component is unmounted, unsubscribe
		// from the event with the `off` method
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<SessionProvider session={session} refetchInterval={60 * 60}>
			<SWRConfig
				value={{
					fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
				}}
			>
				<NextNProgress color="#6366f1" stopDelayMs={50} height={2} startPosition={0.1} />
				<ToastContainer position="top-center" />
				<Component {...pageProps} />
			</SWRConfig>
		</SessionProvider>
	);
}
export default MyApp;
