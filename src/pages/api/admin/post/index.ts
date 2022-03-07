import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { p, s, id } = req.query;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	// for detail
	if (id) {
		const data = await prisma.posts.findFirst({ where: { id: id as string } });

		return res.json({ ...successResponse, data });
	}

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const data = await prisma.posts.findMany({
		skip: (Number(page) - 1) * Number(limit),
		take: Number(limit),
		orderBy: { createdAt: 'desc' },
	});

	res.json({ ...successResponse, data });
}
