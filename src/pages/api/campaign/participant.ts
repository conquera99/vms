import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	const data = await prisma.campaignDetail.findMany({
		where: { campaignId: id as string },
		orderBy: { createdAt: 'asc' },
		select: {
			name: true,
			status: true,
		},
	});

	res.json({ ...successResponse, data });
}
