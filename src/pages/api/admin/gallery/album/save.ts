import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id, title } = req.body;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	if (id) {
		const update = await prisma.albums.update({
			where: { id },
			data: { title, slug: slugify(title), updatedBy: session.user.id },
		});

		return res.json({ ...successResponse, data: update });
	}

	const create = await prisma.albums.create({
		data: { title, slug: slugify(title), createdBy: session.user.id },
	});

	return res.json({ ...successResponse, data: create });
}
