import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	// if (!session) return res.json(forbiddenResponse);

	return res.json({
		...successResponse,
		data: [
			{
				id: 1,
				image: '/images/1.jpg',
				name: 'STI Vihara Sasana Graha Nunukan',
				title: 'Perayaan Magapuja 2022',
				like: 25,
				timestamp: '2022-02-16 15:20:23',
			},
			{
				id: 2,
				image: '/images/2.jpg',
				name: 'STI Vihara Sasana Graha Nunukan',
				title: 'Happy Chinese New Year 2022',
				like: 20,
				timestamp: '2022-02-01 11:20:20',
			},
		],
	});
}
