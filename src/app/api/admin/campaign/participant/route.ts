import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	const data = await prisma.campaignDetail.findMany({
		where: { campaignId: id as string },
		orderBy: [{ group: 'asc' }, { createdAt: 'asc' }],
	});

	const total = await prisma.campaignDetail.aggregate({
		_sum: {
			value: true,
		},
		where: {
			campaignId: id as string,
		},
	});

	return NextResponse.json({ ...successResponse, data, total: total._sum.value || 0 });
}
