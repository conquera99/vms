import type { Metadata } from 'next';

import { prisma } from 'db';
import { DEFAULT_LIMIT, SITE_DESCRIPTION } from 'utils/constant';

import HomeView from './view';

export const revalidate = 300;

export const metadata: Metadata = {
	description: SITE_DESCRIPTION,
	alternates: {
		canonical: '/',
	},
};

export default async function Home() {
	const [campaigns, posts] = await Promise.all([
		prisma.campaign.findMany({
			where: { status: 'A', visible: 'Y' },
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				title: true,
				desc: true,
				slug: true,
				image: true,
			},
		}),
		prisma.posts.findMany({
			where: { status: 'P' },
			orderBy: { createdAt: 'desc' },
			take: DEFAULT_LIMIT,
			select: {
				id: true,
				title: true,
				summary: true,
				slug: true,
				image: true,
				createdAt: true,
			},
		}),
	]);

	return <HomeView initialCampaigns={campaigns} initialPosts={posts} />;
}
