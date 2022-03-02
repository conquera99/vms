import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { p, s } = req.query;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const data = await prisma.albums.findMany({
		skip: (Number(page) - 1) * Number(limit),
		take: Number(limit),
		orderBy: { createdAt: 'desc' },
	});

	res.json({ ...successResponse, data });
}
