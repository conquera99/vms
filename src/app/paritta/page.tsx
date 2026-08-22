import type { Metadata } from 'next';

import ParittaPage from './view';

export const metadata: Metadata = {
	title: { absolute: 'Paritta' },
};

export default function Paritta() {
	return <ParittaPage />;
}
