import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { locId, itemId } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (locId && itemId) {
		const detail = await prisma.itemLocation.findUnique({
			where: {
				locId_itemId: {
					locId,
					itemId,
				},
			},
		});

		if (!detail) {
			return NextResponse.json({ code: 404, message: 'data not found' });
		}

		const process = await prisma.$transaction([
			prisma.itemLocation.deleteMany({
				where: { locId, itemId },
			}),
			prisma.item.updateMany({
				where: { id: itemId },
				data: { assignQty: { decrement: detail?.qty || 0 } },
			}),
		]);

		return NextResponse.json({ ...successResponse, data: process });
	}

	return NextResponse.json({ code: 500, message: 'location id & item id is required' });
}
