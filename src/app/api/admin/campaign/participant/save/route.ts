import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id, name, value, status, group, seq, desc } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

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

		return NextResponse.json({ ...successResponse, data: update });
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

	return NextResponse.json({ ...successResponse, data: create });
}
