import { Html, Head, Main, NextScript } from 'next/document';

const APP_URL = 'https://vsg.nunukan.net';
const APP_NAME = 'VSG iApp';
// const APP_DESC =
// 	'Website STI Vihara Sasana Graha Nunukan yang digunakan untuk melihat kegiatan-kegiatan vihara serta dapat mengatur administrasi dan inventaris vihara';

const Document = () => {
	return (
		<Html lang="id">
			<Head>
				<meta name="application-name" content={APP_NAME} />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content={APP_NAME} />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-config" content="/icons/browserconfig.xml" />
				<meta name="msapplication-TileColor" content="#2B5797" />
				<meta name="msapplication-tap-highlight" content="no" />
				<meta name="theme-color" content="#000000" />

				<link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
				<link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
				<link
					rel="apple-touch-icon"
					sizes="167x167"
					href="/icons/touch-icon-ipad-retina.png"
				/>

				<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=optional"
				/>

				<meta name="twitter:card" content="summary" />
				<meta name="twitter:url" content={APP_URL} />
				{/* <meta name="twitter:title" content={APP_NAME} />
				<meta name="twitter:description" content={APP_DESC} />
				<meta name="twitter:image" content="/icons/android-chrome-192x192.png" /> */}
				<meta name="twitter:creator" content="@conquera99" />

				<meta property="og:type" content="website" />
				{/* <meta property="og:title" content={APP_NAME} />
				<meta property="og:description" content={APP_DESC} /> */}
				<meta property="og:site_name" content={APP_NAME} />
				<meta property="og:url" content={APP_URL} />
				{/* <meta property="og:image" content="/icons/apple-touch-icon.png" /> */}

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

				{/* Global Site Tag (gtag.js) - Google Analytics */}
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
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
