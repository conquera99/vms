import type { Metadata } from 'next';

import { prisma } from 'db';
import { DEFAULT_LIMIT, SITE_DESCRIPTION } from 'utils/constant';

import GalleryView from './view';

export const revalidate = 300;

export const metadata: Metadata = {
	title: 'Galeri',
	description: `Galeri dokumentasi kegiatan Vihara Sasana Graha Nunukan. ${SITE_DESCRIPTION}`,
	alternates: {
		canonical: '/gallery',
	},
};

export default async function GalleryPage() {
	const albums = await prisma.albums.findMany({
		orderBy: { createdAt: 'desc' },
		take: DEFAULT_LIMIT,
		select: {
			id: true,
			title: true,
			slug: true,
			createdAt: true,
		},
	});

	return <GalleryView initialAlbums={albums} />;
}
