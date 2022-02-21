import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { itemId, date, qty, price } = req.body;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	const [create, updateItem] = await prisma.$transaction([
		prisma.itemHistory.create({
			data: { itemId, date, qty, price, createdBy: session.user.id },
		}),
		prisma.item.updateMany({ where: { id: itemId }, data: { totalQty: { increment: qty } } }),
	]);

	return res.json({ ...successResponse, data: { create, updateItem } });
}
