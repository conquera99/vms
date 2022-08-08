import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { p, s, id } = req.query;

	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	// for detail
	if (id) {
		const data = await prisma.deceased.findFirst({ where: { id: id as string } });

		return res.json({ ...successResponse, data });
	}

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const data = await prisma.deceased.findMany({
		skip: (Number(page) - 1) * Number(limit),
		take: Number(limit),
		orderBy: { family: 'asc' },
	});

	const newData = [];

	for (let i = 0; i < data.length; i++) {
		const payload = `${data[i].imageId}/${data[i].image?.split('/').pop()}`;

		const key = crypto
			.createHash('sha1')
			.update(`/${payload}${process.env.CLOUDINARY_API_SECRET}`)
			.digest('base64');

		newData.push({
			...data[i],
			url: `https://res.cloudinary.com/vihara-sasana-graha/image/upload/${key}/${payload}`,
		});
	}

	res.json({ ...successResponse, data });
}
