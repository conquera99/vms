import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id, name } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	if (id) {
		const update = await prisma.location.update({
			where: { id },
			data: { name, updatedBy: session.user.id },
		});

		return res.json({ ...successResponse, data: update });
	}

	const code: Record<string, string>[] | undefined =
		await prisma.$queryRaw`SELECT LPAD(IFNULL(MAX(loc_code), 0)+1, 3, '0') as 'seq' from locations`;

	const create = await prisma.location.create({
		data: { code: code?.[0]?.seq as string, name, createdBy: session.user.id },
	});

	return res.json({ ...successResponse, data: create });
}
