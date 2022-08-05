import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	const locationCount = await prisma.location.count();
	const itemCategoryCount = await prisma.itemCategory.count();
	const itemCount = await prisma.item.count();
	const memberCount = await prisma.member.count();
	const userCount = await prisma.user.count();
	const permissionCount = await prisma.permissions.count();
	const postCount = await prisma.posts.count();
	const albumCount = await prisma.albums.count();
	const imagesCount = await prisma.images.count();
	const campaignCount = await prisma.campaign.count();
	const deceasedCount = await prisma.deceased.count();

	res.json({
		...successResponse,
		data: {
			location: locationCount,
			itemCategory: itemCategoryCount,
			item: itemCount,
			member: memberCount,
			user: userCount,
			permission: permissionCount,
			campaign: campaignCount,
			post: postCount,
			album: albumCount,
			image: imagesCount,
			deceased: deceasedCount,
		},
	});
}
