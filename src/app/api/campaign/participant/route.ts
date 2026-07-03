import { NextRequest } from 'next/server';

import { prisma } from 'db';
import { successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get('id');

	const data = await prisma.campaignDetail.findMany({
		where: { campaignId: id as string },
		orderBy: { createdAt: 'asc' },
		select: {
			name: true,
			status: true,
		},
	});

	return Response.json({ ...successResponse, data });
}
