'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { Analytics } from '@vercel/analytics/react';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { AppProgressBar } from 'next-nprogress-bar';

import GaTracker from 'components/general/ga-tracker';

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

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider refetchInterval={60 * 60}>
			<SWRConfig
				value={{
					fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
				}}
			>
				<ConfigProvider theme={antdTheme}>
					<AntdApp>
						<AppProgressBar
							color="#6366f1"
							height="2px"
							options={{ minimum: 0.1, showSpinner: false }}
						/>
						<GaTracker />
						{children}
						<Analytics />
					</AntdApp>
				</ConfigProvider>
			</SWRConfig>
		</SessionProvider>
	);
}
