import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { itemId, locId, qty } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	const detailItem = await prisma.item.findUnique({ where: { id: itemId } });

	if (!detailItem) {
		return NextResponse.json({ code: 404, message: 'item not found' });
	}

	const detailLoc = await prisma.location.findUnique({ where: { id: locId } });

	if (!detailLoc) {
		return NextResponse.json({ code: 404, message: 'location not found' });
	}

	if (Number(detailItem.assignQty) + qty > Number(detailItem.totalQty)) {
		return NextResponse.json({ code: 500, message: 'tidak ada qty yang tersisa' });
	}

	const [create, updateItem] = await prisma.$transaction([
		prisma.itemLocation.create({
			data: {
				code: `${detailLoc.code}.${detailItem.code}`,
				itemId,
				locId,
				qty,
				createdBy: session.user.id,
			},
		}),
		prisma.item.updateMany({ where: { id: itemId }, data: { assignQty: { increment: qty } } }),
	]);

	return NextResponse.json({ ...successResponse, data: { create, updateItem } });
}
