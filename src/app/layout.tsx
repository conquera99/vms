import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import Providers from './providers';

import 'styles/globals.css';
import 'antd/dist/reset.css';
import 'styles/antd-overrides.css';

const APP_URL = 'https://vsg.nunukan.net';
const APP_NAME = 'VSG iApp';

export const metadata: Metadata = {
	metadataBase: new URL(APP_URL),
	title: { default: 'VSG', template: '%s | VSG' },
	description: 'app for vihara sasana graha nunukan',
	applicationName: APP_NAME,
	manifest: '/manifest.json',
	formatDetection: { telephone: false },
	icons: {
		shortcut: '/favicon.ico',
		icon: [
			{ url: '/icons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
			{ url: '/icons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
		],
		apple: [
			{ url: '/icons/touch-icon-iphone.png' },
			{ url: '/icons/apple-touch-icon.png', sizes: '152x152' },
			{ url: '/icons/apple-touch-icon.png', sizes: '180x180' },
			{ url: '/icons/apple-touch-icon.png', sizes: '167x167' },
		],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: APP_NAME,
	},
	twitter: {
		card: 'summary',
		creator: '@conquera99',
	},
	openGraph: {
		type: 'website',
		siteName: APP_NAME,
		url: APP_URL,
	},
	other: {
		'mobile-web-app-capable': 'yes',
		'msapplication-config': '/icons/browserconfig.xml',
		'msapplication-TileColor': '#2B5797',
		'msapplication-tap-highlight': 'no',
	},
};

export const viewport: Viewport = {
	themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="id">
			<body>
				{/* PWA splash screens and Safari mask icon are not covered by the metadata API */}
				<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
				<link
					rel="apple-touch-startup-image"
					href="/splash/ipadpro2_splash.png"
					sizes="2048x2732"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/ipadpro1_splash.png"
					sizes="1668x2224"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/ipadpro3_splash.png"
					sizes="1668x2388"
				/>
				<link rel="apple-touch-startup-image" href="/splash/ipad_splash.png" sizes="1536x2048" />
				<link
					rel="apple-touch-startup-image"
					href="/splash/iphonex_splash.png"
					sizes="1125x2436"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/iphoneplus_splash.png"
					sizes="1242x2208"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/iphone6_splash.png"
					sizes="750x1334"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/iphone5_splash.png"
					sizes="640x1136"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/iphonexr_splash.png"
					sizes="828x1792"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/iphonexsmax_splash.png"
					sizes="1242x2688"
				/>
				{/* false positive: this is the app router root layout, not a per-page head */}
				{/* eslint-disable-next-line @next/next/no-page-custom-font */}
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=optional"
				/>

				{/* Global Site Tag (gtag.js) - Google Analytics */}
				<Script
					async
					src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
					strategy="afterInteractive"
				/>
				<Script id="ga-init" strategy="afterInteractive">
					{`window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
						page_path: window.location.pathname,
						});`}
				</Script>

				<AntdRegistry hashPriority="low">
					<Providers>{children}</Providers>
				</AntdRegistry>
			</body>
		</html>
	);
}
