import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';
import cloudinary from 'utils/cloudinary';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	if (id) {
		const detail = await prisma.member.findFirst({
			where: { id },
		});

		if (!detail) {
			return res.json({ code: 404, message: 'data not found' });
		}

		// const employees = await prisma.location.findMany({ where: { titleId: id } });

		// if (employees.length > 0) {
		// 	return res.json({ ...stillInUseResponse });
		// }

		const update = await prisma.member.delete({
			where: { id },
		});

		let deleteImage = null;

		if (detail.imageId) {
			deleteImage = await cloudinary.v2.api.delete_resources([detail.imageId]);
		}

		return res.json({ ...successResponse, data: { update, deleteImage } });
	}

	return res.json({ code: 500, message: 'id is required' });
}
