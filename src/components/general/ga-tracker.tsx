'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { pageview } from 'utils/ga';

// replaces the pages-router router.events pageview tracking from _app.tsx
const GaTracker = () => {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname) {
			pageview(pathname);
		}
	}, [pathname]);

	return null;
};

export default GaTracker;
