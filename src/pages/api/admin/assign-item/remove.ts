import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { locId, itemId } = req.body;

	const session = await getSession({ req });

	if (!session) return res.json(forbiddenResponse);

	if (locId && itemId) {
		// const employees = await prisma.location.findMany({ where: { titleId: id } });

		// if (employees.length > 0) {
		// 	return res.json({ ...stillInUseResponse });
		// }

		const update = await prisma.itemLocation.deleteMany({
			where: { locId, itemId },
		});

		return res.json({ ...successResponse, data: update });
	}

	return res.json({ code: 500, message: 'location id & item id is required' });
}
