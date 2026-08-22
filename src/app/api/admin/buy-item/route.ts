import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const p = searchParams.get('p');
	const s = searchParams.get('s');
	const id = searchParams.get('id');

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	// for detail
	if (id) {
		const data = await prisma.itemHistory.findFirst({ where: { id } });

		return NextResponse.json({ ...successResponse, data });
	}

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const data =
		await prisma.$queryRaw`SELECT * FROM item_history JOIN items ON item_id=ih_item_id ORDER BY ih_created_at DESC LIMIT ${limit} OFFSET ${
			(page - 1) * limit
		}`;

	return NextResponse.json({ ...successResponse, data });
}
