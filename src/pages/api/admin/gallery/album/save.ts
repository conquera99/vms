import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id, title } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	const slug = slugify(title);

	if (id) {
		const update = await prisma.albums.update({
			where: { id },
			data: { title, slug, updatedBy: session.user.id },
		});

		return res.json({ ...successResponse, data: update });
	}

	const create = await prisma.albums.create({
		data: { title, slug, createdBy: session.user.id },
	});

	await res.unstable_revalidate(`/gallery/album/${slug}`);

	return res.json({ ...successResponse, data: create });
}
