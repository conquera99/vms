import { NextRequest } from 'next/server';

import { prisma } from 'db';
import { DEFAULT_LIMIT, successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const p = searchParams.get('p');
    const s = searchParams.get('s');

    const page = Number(p || 1);
    const limit = Number(s || DEFAULT_LIMIT);

    const data = await prisma.posts.findMany({
        where: { status: 'P' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
    });

    return Response.json({ ...successResponse, data });
}
