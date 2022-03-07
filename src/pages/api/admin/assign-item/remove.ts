import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { locId, itemId } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	if (locId && itemId) {
		const detail = await prisma.itemLocation.findUnique({
			where: {
				locId_itemId: {
					locId,
					itemId,
				},
			},
		});

		if (!detail) {
			return res.json({ code: 404, message: 'data not found' });
		}

		const process = await prisma.$transaction([
			prisma.itemLocation.deleteMany({
				where: { locId, itemId },
			}),
			prisma.item.updateMany({
				where: { id: itemId },
				data: { assignQty: { decrement: detail?.qty || 0 } },
			}),
		]);

		return res.json({ ...successResponse, data: process });
	}

	return res.json({ code: 500, message: 'location id & item id is required' });
}
