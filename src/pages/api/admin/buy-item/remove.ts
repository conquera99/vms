import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';
import cloudinary from 'utils/cloudinary';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	if (id) {
		const detail = await prisma.itemHistory.findFirst({
			where: { id },
		});

		if (!detail) {
			return res.json({ code: 404, message: 'data not found' });
		}

		const itemDetail = await prisma.item.findUnique({
			where: { id: detail.itemId },
		});

		if (!itemDetail) {
			return res.json({ code: 404, message: 'item not found' });
		}

		if (Number(itemDetail.totalQty) - Number(detail.qty) < Number(itemDetail.assignQty)) {
			return res.json({
				code: 404,
				message: 'total qty lebih kecil dibandingkan qty yang digunakan',
			});
		}

		const process = await prisma.$transaction([
			prisma.itemHistory.deleteMany({
				where: { id },
			}),
			prisma.item.updateMany({
				where: { id: detail.itemId },
				data: { totalQty: { decrement: detail.qty || 0 } },
			}),
		]);

		let deleteImage = null;

		if (detail.imageId) {
			deleteImage = await cloudinary.v2.api.delete_resources([detail.imageId]);
		}

		return res.json({ ...successResponse, data: { process, deleteImage } });
	}

	return res.json({ code: 500, message: 'id is required' });
}
