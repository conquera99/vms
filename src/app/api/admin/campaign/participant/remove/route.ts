import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id, seq } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (id) {
		const update = await prisma.campaignDetail.delete({
			where: {
				campaignId_seq: {
					campaignId: id as string,
					seq,
				},
			},
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	return NextResponse.json({ code: 500, message: 'id is required' });
}
