import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';

import { auth } from 'auth';
import { uploadBuffer } from 'utils/cloudinary';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	const formData = await request.formData();

	const field = (name: string) => {
		const value = formData.get(name);
		return typeof value === 'string' ? value : undefined;
	};

	const img = formData.get('img');
	const file = img instanceof File && img.size > 0 ? img : null;

	// upload
	let upload;

	if (file) {
		upload = await uploadBuffer(Buffer.from(await file.arrayBuffer()), { folder: 'item' });
	}

	const [create, updateItem] = await prisma.$transaction([
		prisma.itemHistory.create({
			data: {
				itemId: field('itemId') as string,
				date: dayjs(field('date')).toDate(),
				qty: field('qty') as string,
				price: field('price') as string,
				image: upload?.secure_url,
				imageId: upload?.public_id,
				createdBy: session.user.id,
			},
		}),
		prisma.item.updateMany({
			where: { id: field('itemId') },
			data: { totalQty: { increment: field('qty') } },
		}),
	]);

	return NextResponse.json({ ...successResponse, data: { create, updateItem, upload } });
}
