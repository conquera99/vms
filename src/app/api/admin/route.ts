import { NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function GET() {
	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

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
			prisma.location.count(),
			prisma.itemCategory.count(),
			prisma.item.count(),
			prisma.member.count(),
			prisma.user.count(),
			prisma.permissions.count(),
			prisma.posts.count(),
			prisma.albums.count(),
			prisma.images.count(),
			prisma.campaign.count(),
			prisma.deceased.count(),
		]);

		return NextResponse.json({
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
	} catch (error) {
		return NextResponse.json({ code: 500, message: (error as Error).message }, { status: 500 });
	}
}
