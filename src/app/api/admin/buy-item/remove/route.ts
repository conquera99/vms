import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import cloudinary from 'utils/cloudinary';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (id) {
		const detail = await prisma.itemHistory.findFirst({
			where: { id },
		});

		if (!detail) {
			return NextResponse.json({ code: 404, message: 'data not found' });
		}

		const itemDetail = await prisma.item.findUnique({
			where: { id: detail.itemId },
		});

		if (!itemDetail) {
			return NextResponse.json({ code: 404, message: 'item not found' });
		}

		if (Number(itemDetail.totalQty) - Number(detail.qty) < Number(itemDetail.assignQty)) {
			return NextResponse.json({
				code: 404,
				message: 'total qty lebih kecil dibandingkan qty yang digunakan',
			});
		}

		const process = await prisma.$transaction([
			prisma.itemHistory.deleteMany({
				where: { id },
			}),
			prisma.item.updateMany({
				where: { id: detail.itemId },
				data: { totalQty: { decrement: detail.qty || 0 } },
			}),
		]);

		let deleteImage = null;

		if (detail.imageId) {
			deleteImage = await cloudinary.v2.api.delete_resources([detail.imageId]);
		}

		return NextResponse.json({ ...successResponse, data: { process, deleteImage } });
	}

	return NextResponse.json({ code: 500, message: 'id is required' });
}
