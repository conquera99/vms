import type { Metadata } from 'next';

import Gallery from './view';

export const metadata: Metadata = {
	title: { absolute: 'VMS: Galeri' },
};

export default function GalleryPage() {
	return <Gallery />;
}
