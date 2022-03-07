import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { itemId, locId, qty } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	const detailItem = await prisma.item.findUnique({ where: { id: itemId } });

	if (!detailItem) {
		return res.json({ code: 404, message: 'item not found' });
	}

	if (Number(detailItem.assignQty) + qty > Number(detailItem.totalQty)) {
		return res.json({ code: 500, message: 'tidak ada qty yang tersisa' });
	}

	const [create, updateItem] = await prisma.$transaction([
		prisma.itemLocation.create({
			data: { itemId, locId, qty, createdBy: session.user.id },
		}),
		prisma.item.updateMany({ where: { id: itemId }, data: { assignQty: { increment: qty } } }),
	]);

	return res.json({ ...successResponse, data: { create, updateItem } });
}
