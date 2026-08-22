import { NextResponse } from 'next/server';

import { prisma } from 'db';
import { successResponse } from 'utils/constant';

export async function GET() {
	const data = await prisma.campaign.findMany({
		where: { status: 'A', visible: 'Y' },
		orderBy: { createdAt: 'desc' },
	});

	return NextResponse.json({ ...successResponse, data });
}
