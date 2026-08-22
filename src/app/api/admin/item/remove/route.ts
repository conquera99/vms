import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (id) {
		const itemHistory = await prisma.itemHistory.findMany({ where: { itemId: id } });

		if (itemHistory.length > 0) {
			return NextResponse.json({ ...stillInUseResponse });
		}

		const itemLocation = await prisma.itemLocation.findMany({ where: { itemId: id } });

		if (itemLocation.length > 0) {
			return NextResponse.json({ ...stillInUseResponse });
		}

		const update = await prisma.item.delete({
			where: { id },
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	return NextResponse.json({ code: 500, message: 'id is required' });
}
