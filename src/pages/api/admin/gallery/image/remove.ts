import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';
import cloudinary from 'utils/cloudinary';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.body;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	if (id) {
		const detail = await prisma.images.findFirst({
			where: { id },
		});

		if (!detail) {
			return res.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.images.delete({
			where: { id },
		});

		let deleteImage = null;

		if (detail.id) {
			deleteImage = await cloudinary.v2.api.delete_resources([detail.id]);
		}

		return res.json({ ...successResponse, data: { update, deleteImage } });
	}

	return res.json({ code: 500, message: 'id is required' });
}
