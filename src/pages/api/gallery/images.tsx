import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { p, s, albumId } = req.query;

    //for list
    const page = Number(p || 1);
    const limit = Number(s || DEFAULT_LIMIT);

    const data = await prisma.images.findMany({
        where: { albumId: albumId as string },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
    });

    res.json({ ...successResponse, data });
}
