import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id, name, categoryId, desc } = req.body;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	if (id) {
		const update = await prisma.item.update({
			where: { id },
			data: { name, categoryId, updatedBy: session.user.id },
		});

		return res.json({ ...successResponse, data: update });
	}

	const create = await prisma.item.create({
		data: { name, categoryId, desc, createdBy: session.user.id },
	});

	return res.json({ ...successResponse, data: create });
}
