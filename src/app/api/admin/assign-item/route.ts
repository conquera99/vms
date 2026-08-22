import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const p = searchParams.get('p');
	const s = searchParams.get('s');
	const locId = searchParams.get('locId');
	const itemId = searchParams.get('itemId');

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	// for detail
	if (locId && itemId) {
		const data = await prisma.itemLocation.findFirst({
			where: { locId, itemId },
		});

		return NextResponse.json({ ...successResponse, data });
	}

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const data =
		await prisma.$queryRaw`SELECT * FROM item_location JOIN locations ON loc_id=il_loc_id JOIN items ON item_id=il_item_id ORDER BY il_created_at DESC LIMIT ${limit} OFFSET ${
			(page - 1) * limit
		}`;

	return NextResponse.json({ ...successResponse, data });
}
