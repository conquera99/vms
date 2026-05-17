import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { Analytics } from '@vercel/analytics/react';
import { App as AntdApp, ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

import 'styles/globals.css';

import 'antd/dist/reset.css';
import 'styles/antd-overrides.css';

import type { AppProps } from 'next/app';
import { pageview } from 'utils/ga';

const antdTheme: ThemeConfig = {
	token: {
		colorPrimary: '#7ea7cb',
		colorInfo: '#7ea7cb',
		colorBorder: '#d8e4ee',
		colorText: '#334155',
		colorTextPlaceholder: '#94a3b8',
		colorBgContainer: '#ffffff',
		colorBgElevated: 'rgba(255,255,255,0.96)',
		borderRadius: 14,
		borderRadiusLG: 18,
		controlHeight: 46,
		controlHeightLG: 50,
		boxShadowSecondary: '0 18px 40px rgba(148,163,184,0.14)',
	},
	components: {
		Form: {
			labelColor: '#64748b',
			labelFontSize: 12,
			labelHeight: 20,
			verticalLabelPadding: '0 0 8px',
		},
		Input: {
			hoverBorderColor: '#b3cbdf',
			activeBorderColor: '#7ea7cb',
			activeShadow: '0 0 0 4px rgba(126,167,203,0.14)',
		},
		InputNumber: {
			hoverBorderColor: '#b3cbdf',
			activeBorderColor: '#7ea7cb',
			activeShadow: '0 0 0 4px rgba(126,167,203,0.14)',
		},
		Select: {
			hoverBorderColor: '#b3cbdf',
			activeBorderColor: '#7ea7cb',
			activeOutlineColor: 'rgba(126,167,203,0.14)',
			optionSelectedBg: '#edf4fa',
			optionActiveBg: '#f5f8fb',
		},
		DatePicker: {
			hoverBorderColor: '#b3cbdf',
			activeBorderColor: '#7ea7cb',
			activeShadow: '0 0 0 4px rgba(126,167,203,0.14)',
			cellActiveWithRangeBg: '#edf4fa',
		},
	},
};

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
