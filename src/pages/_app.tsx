import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { Analytics } from '@vercel/analytics/react';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

import 'styles/globals.css';

import 'antd/dist/reset.css';
import 'styles/antd-overrides.css';

import type { AppProps } from 'next/app';
import { pageview } from 'utils/ga';

import { antdTheme } from 'styles/antd-theme';

ConfigProvider.config({
	holderRender: (children) => (
		<StyleProvider hashPriority="low">
			<ConfigProvider theme={antdTheme}>
				<AntdApp>{children}</AntdApp>
			</ConfigProvider>
		</StyleProvider>
	),
});

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
				<StyleProvider hashPriority="low">
					<ConfigProvider theme={antdTheme}>
						<AntdApp>
							<NextNProgress
								color="#6366f1"
								stopDelayMs={50}
								height={2}
								startPosition={0.1}
							/>
							<Component {...pageProps} />
							<Analytics />
						</AntdApp>
					</ConfigProvider>
				</StyleProvider>
			</SWRConfig>
		</SessionProvider>
	);
}
export default MyApp;
