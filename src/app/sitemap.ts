import type { MetadataRoute } from 'next';

import { prisma } from 'db';
import { SITE_URL } from 'utils/constant';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [posts, campaigns, albums] = await Promise.all([
		prisma.posts.findMany({
			where: { status: 'P' },
			select: { slug: true, updatedAt: true },
		}),
		prisma.campaign.findMany({
			where: { status: 'A', visible: 'Y' },
			select: { slug: true, updatedAt: true },
		}),
		prisma.albums.findMany({
			select: { slug: true, updatedAt: true },
		}),
	]);

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: SITE_URL, changeFrequency: 'daily', priority: 1 },
		{ url: `${SITE_URL}/paritta`, changeFrequency: 'monthly', priority: 0.8 },
		{ url: `${SITE_URL}/gallery`, changeFrequency: 'weekly', priority: 0.7 },
	];

	return [
		...staticRoutes,
		...posts.map((post) => ({
			url: `${SITE_URL}/post/${post.slug}`,
			lastModified: post.updatedAt,
			changeFrequency: 'monthly' as const,
			priority: 0.8,
		})),
		...campaigns.map((campaign) => ({
			url: `${SITE_URL}/campaign/${campaign.slug}`,
			lastModified: campaign.updatedAt,
			changeFrequency: 'monthly' as const,
			priority: 0.6,
		})),
		...albums.map((album) => ({
			url: `${SITE_URL}/gallery/album/${album.slug}`,
			lastModified: album.updatedAt,
			changeFrequency: 'monthly' as const,
			priority: 0.5,
		})),
	];
}
