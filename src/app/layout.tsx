import type { Metadata } from 'next';
import AntdStyleRegistry from './style-registry';
import Providers from './providers';
import './globals.css';

const APP_URL = 'https://vsg.nunukan.net';
const APP_NAME = 'VSG iApp';

export const metadata: Metadata = {
	title: {
		default: 'VSG iApp',
		template: '%s | VSG iApp',
	},
	description: 'Website STI Vihara Sasana Graha Nunukan',
	metadataBase: new URL(APP_URL),
	applicationName: APP_NAME,
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: APP_NAME,
	},
	formatDetection: {
		telephone: false,
	},
	manifest: '/manifest.json',
	icons: {
		icon: [
			{ url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
		],
		shortcut: '/favicon.ico',
		apple: [
			{ url: '/icons/touch-icon-iphone.png' },
			{ url: '/icons/apple-touch-icon.png', sizes: '152x152' },
			{ url: '/icons/apple-touch-icon.png', sizes: '180x180' },
			{ url: '/icons/touch-icon-ipad-retina.png', sizes: '167x167' },
		],
	},
	other: {
		'msapplication-config': '/icons/browserconfig.xml',
		'msapplication-TileColor': '#2B5797',
		'msapplication-tap-highlight': 'no',
		'theme-color': '#000000',
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
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="id">
			<head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=optional"
				/>
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
				<link
					rel="apple-touch-startup-image"
					href="/splash/ipad_splash.png"
					sizes="1536x2048"
				/>
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
				<script
					async
					src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
								page_path: window.location.pathname,
								});`,
					}}
				/>
			</head>
			<body>
				<AntdStyleRegistry>
					<Providers>
						{children}
					</Providers>
				</AntdStyleRegistry>
			</body>
		</html>
	);
}
