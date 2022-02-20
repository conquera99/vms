import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.body;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	if (id) {
		// const employees = await prisma.location.findMany({ where: { titleId: id } });

		// if (employees.length > 0) {
		// 	return res.json({ ...stillInUseResponse });
		// }

		const update = await prisma.member.delete({
			where: { id },
		});

		return res.json({ ...successResponse, data: update });
	}

	return res.json({ code: 500, message: 'id is required' });
}
