import Head from 'next/head';
import { FC } from 'react';

import PageHeadInterface from 'interfaces/general';

const PageHead: FC<PageHeadInterface> = ({ title, desc }) => {
	return (
		<Head>
			<title>{title || 'VSG'}</title>
			<meta name="description" content={desc || 'app for vihara sasana graha nunukan'} />
			<meta name="viewport" content="width=device-width" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
};

export default PageHead;
