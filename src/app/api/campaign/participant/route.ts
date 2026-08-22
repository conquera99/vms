import { NextRequest, NextResponse } from 'next/server';

import { prisma } from 'db';
import { successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	const data = await prisma.campaignDetail.findMany({
		where: { campaignId: id as string },
		orderBy: { createdAt: 'asc' },
		select: {
			name: true,
			status: true,
		},
	});

	return NextResponse.json({ ...successResponse, data });
}
