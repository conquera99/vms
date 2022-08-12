import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	const data = await prisma.campaignDetail.findMany({
		where: { campaignId: id as string },
		orderBy: [{ group: 'asc' }, { createdAt: 'asc' }],
	});

	const total = await prisma.campaignDetail.aggregate({
		_sum: {
			value: true,
		},
		where: {
			campaignId: id as string,
		},
	});

	res.json({ ...successResponse, data, total: total._sum.value || 0 });
}
