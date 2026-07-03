import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) return Response.json(forbiddenResponse, { status: 403 });

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

	try {
		const [
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
		] = await Promise.all([
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
		]);

		return Response.json({
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
	} catch (error: any) {
		return Response.json({
			code: 500,
			message: error.message,
		}, { status: 500 });
	}
}
