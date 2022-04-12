import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const data = await prisma.campaign.findMany({
		where: { status: 'A' },
		orderBy: { createdAt: 'desc' },
	});

	res.json({ ...successResponse, data });
}
