import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id, name, categoryId, desc } = req.body;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	if (id) {
		const update = await prisma.item.update({
			where: { id },
			data: { name, categoryId, updatedBy: session.user.id },
		});

		return res.json({ ...successResponse, data: update });
	}

	// get item category by id
	const itemCategory = await prisma.itemCategory.findUnique({ where: { id: categoryId } });

	const prefixLength = Number(itemCategory?.code.length) + 2;

	const code: Record<string, string>[] | undefined =
		await prisma.$queryRaw`SELECT LPAD(IFNULL(MAX(SUBSTR(item_code, ${prefixLength})), 0)+1, 6, '0') as 'seq' from items`;

	const create = await prisma.item.create({
		data: {
			name,
			code: `${itemCategory?.code}.${code?.[0]?.seq as string}`,
			categoryId,
			desc,
			createdBy: session.user.id,
		},
	});

	return res.json({ ...successResponse, data: create });
}
