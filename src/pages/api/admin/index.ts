import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	const locationCount = await prisma.location.count();
	const itemCategoryCount = await prisma.itemCategory.count();
	const itemCount = await prisma.item.count();
	const memberCount = await prisma.member.count();
	const userCount = await prisma.user.count();

	res.json({
		...successResponse,
		data: {
			location: locationCount,
			itemCategory: itemCategoryCount,
			item: itemCount,
			member: memberCount,
			user: userCount,
		},
	});
}
