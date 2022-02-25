import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id, name } = req.body;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	if (id) {
		const update = await prisma.itemCategory.update({
			where: { id },
			data: { name, updatedBy: session.user.id },
		});

		return res.json({ ...successResponse, data: update });
	}

	const code: Record<string, string>[] | undefined =
		await prisma.$queryRaw`SELECT LPAD(IFNULL(MAX(ic_code), 0)+1, 4, '0') as 'seq' from item_categories`;

	const create = await prisma.itemCategory.create({
		data: { name, code: code?.[0]?.seq as string, createdBy: session.user.id },
	});

	return res.json({ ...successResponse, data: create });
}
