import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { name } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	if (name) {
		// const employees = await prisma.location.findMany({ where: { titleId: id } });

		// if (employees.length > 0) {
		// 	return res.json({ ...stillInUseResponse });
		// }

		const update = await prisma.permissions.delete({
			where: { name },
		});

		return res.json({ ...successResponse, data: update });
	}

	return res.json({ code: 500, message: 'name is required' });
}
