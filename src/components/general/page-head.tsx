import Head from 'next/head';
import { FC } from 'react';

import PageHeadInterface from 'interfaces/general';

const PageHead: FC<PageHeadInterface> = ({ title, desc, image }) => {
	return (
		<Head>
			<title>{title || 'VSG'}</title>
			<meta name="description" content={desc || 'app for vihara sasana graha nunukan'} />
			<meta
				name="viewport"
				content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
			/>
			<link rel="icon" href="/favicon.ico" />

			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={desc} />
			<meta name="twitter:image" content={image || '/icons/android-chrome-192x192.png'} />

			<meta property="og:title" content={title} />
			<meta property="og:description" content={desc} />
			<meta property="og:image" content={image || '/icons/apple-touch-icon.png'} />
		</Head>
	);
};

export default PageHead;
