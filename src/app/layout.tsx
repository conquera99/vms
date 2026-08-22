import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Raleway } from 'next/font/google';

import Providers from './providers';

import 'styles/globals.css';
import 'antd/dist/reset.css';
import 'styles/antd-overrides.css';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from 'utils/constant';

const raleway = Raleway({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-raleway',
});

const APP_NAME = 'VSG iApp';

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: { default: 'VSG', template: '%s | VSG' },
	description: SITE_DESCRIPTION,
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
		card: 'summary_large_image',
		creator: '@conquera99',
	},
	openGraph: {
		type: 'website',
		siteName: APP_NAME,
		url: SITE_URL,
		title: `VSG — ${SITE_NAME}`,
		description: SITE_DESCRIPTION,
		locale: 'id_ID',
		images: [{ url: '/og-default.png', width: 1200, height: 630, alt: SITE_NAME }],
	},
	other: {
		'mobile-web-app-capable': 'yes',
		'msapplication-config': '/icons/browserconfig.xml',
		'msapplication-TileColor': '#2B5797',
		'msapplication-tap-highlight': 'no',
	},
};

export const viewport: Viewport = {
	themeColor: '#7ea7cb',
};

const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'PlaceOfWorship',
	name: SITE_NAME,
	alternateName: 'VSG',
	url: SITE_URL,
	logo: `${SITE_URL}/logo.png`,
	image: `${SITE_URL}/og-default.png`,
	address: {
		'@type': 'PostalAddress',
		streetAddress: 'Jl. Cut Nyak Dien RT. 15, Kel. Nunukan Tengah',
		addressLocality: 'Nunukan',
		addressRegion: 'Kalimantan Utara',
		addressCountry: 'ID',
	},
	sameAs: [
		'https://www.facebook.com/vsg.nunukan',
		'https://www.youtube.com/@vsg.nunukan',
		'https://www.instagram.com/vsg.nunukan/',
	],
};

const websiteJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: 'VSG',
	url: SITE_URL,
	inLanguage: 'id',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="id" className={raleway.variable}>
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

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
				/>

				<AntdRegistry hashPriority="low">
					<Providers>{children}</Providers>
				</AntdRegistry>
			</body>
		</html>
	);
}
