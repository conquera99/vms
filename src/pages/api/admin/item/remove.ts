import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	if (id) {
		const itemHistory = await prisma.itemHistory.findMany({ where: { itemId: id } });

		if (itemHistory.length > 0) {
			return res.json({ ...stillInUseResponse });
		}

		const itemLocation = await prisma.itemLocation.findMany({ where: { itemId: id } });

		if (itemLocation.length > 0) {
			return res.json({ ...stillInUseResponse });
		}

		const update = await prisma.item.delete({
			where: { id },
		});

		return res.json({ ...successResponse, data: update });
	}

	return res.json({ code: 500, message: 'id is required' });
}
