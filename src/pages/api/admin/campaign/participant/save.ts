import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id, name, value, status, group, seq, desc } = req.body;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	if (seq) {
		const update = await prisma.campaignDetail.update({
			data: {
				name,
				value,
				desc,
				group,
				status,
				updatedBy: session.user.id,
			},
			where: {
				campaignId_seq: {
					campaignId: id as string,
					seq: seq,
				},
			},
		});

		return res.json({ ...successResponse, data: update });
	}

	const campaignSeq = await prisma.campaignDetail.aggregate({
		_max: {
			seq: true,
		},
		where: {
			campaignId: id as string,
		},
	});

	const sequence = campaignSeq._max.seq || 1;

	const create = await prisma.campaignDetail.create({
		data: {
			campaignId: id as string,
			seq: sequence + 1,
			name,
			value,
			group,
			desc,
			status,
			createdBy: session.user.id,
		},
	});

	return res.json({ ...successResponse, data: create });
}
