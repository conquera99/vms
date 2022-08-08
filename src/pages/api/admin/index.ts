import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	const locationQuery = prisma.location.count();
	const itemCategoryQuery = prisma.itemCategory.count();
	const itemQuery = prisma.item.count();
	const memberQuery = prisma.member.count();
	const userQuery = prisma.user.count();
	const permissionQuery = prisma.permissions.count();
	const postQuery = prisma.posts.count();
	const albumQuery = prisma.albums.count();
	const imagesQuery = prisma.images.count();
	const campaignQuery = prisma.campaign.count();
	const deceasedQuery = prisma.deceased.count();

	return Promise.all([
		locationQuery,
		itemCategoryQuery,
		itemQuery,
		memberQuery,
		userQuery,
		permissionQuery,
		postQuery,
		albumQuery,
		imagesQuery,
		campaignQuery,
		deceasedQuery,
	])
		.then(
			([
				locationCount,
				itemCategoryCount,
				itemCount,
				memberCount,
				userCount,
				permissionCount,
				postCount,
				albumCount,
				imagesCount,
				campaignCount,
				deceasedCount,
			]) => {
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
			},
		)
		.catch((error) => {
			res.status(500).json({
				code: 500,
				message: error.message,
			});
		});
}
