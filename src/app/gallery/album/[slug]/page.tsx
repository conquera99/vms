import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dayjs from 'dayjs';

import { prisma } from 'db';
import { SITE_URL, datetimeFormat } from 'utils/constant';

import Page from './view';

async function getAlbum(slug: string) {
	const data = await prisma.albums.findFirst({ where: { slug } });

	if (!data) {
		return null;
	}

	return {
		...data,
		createdAt: dayjs(data.createdAt).format(datetimeFormat),
		updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
	};
}

export async function generateStaticParams() {
	return [{ slug: 'Magha-Puja-2022' }];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const detail = await getAlbum(slug);

	if (!detail) return {};

	return {
		title: detail.title,
		description: `Galeri foto ${detail.title} — dokumentasi kegiatan Vihara Sasana Graha Nunukan.`,
		alternates: {
			canonical: `/gallery/album/${detail.slug}`,
		},
		openGraph: {
			title: detail.title,
			url: `/gallery/album/${detail.slug}`,
			images: ['/og-default.png'],
		},
		twitter: {
			card: 'summary_large_image',
			title: detail.title,
			images: ['/og-default.png'],
		},
	};
}

export default async function AlbumPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const detail = await getAlbum(slug);

	if (!detail) {
		notFound();
	}

	const images = await prisma.images.findMany({
		where: { albumId: detail.id },
		select: { image: true, altText: true },
		orderBy: { createdAt: 'asc' },
		take: 60,
	});

	const galleryJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ImageGallery',
		name: detail.title,
		url: `${SITE_URL}/gallery/album/${detail.slug}`,
		image: images.map((image) => image.image),
		inLanguage: 'id',
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
			/>
			<Page detail={detail} />
		</>
	);
}
