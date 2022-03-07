import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { name } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	const detail = await prisma.permissions.findUnique({ where: { name } });

	if (detail) {
		const update = await prisma.permissions.update({
			where: { name: name as string },
			data: { name },
		});

		return res.json({ ...successResponse, data: update });
	}

	const create = await prisma.permissions.create({
		data: { name },
	});

	return res.json({ ...successResponse, data: create });
}
