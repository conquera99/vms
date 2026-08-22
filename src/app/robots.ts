import type { MetadataRoute } from 'next';

import { SITE_URL } from 'utils/constant';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin', '/api', '/signin', '/profile'],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
