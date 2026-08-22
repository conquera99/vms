import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';

import { auth } from 'auth';
import cloudinary, { uploadBuffer } from 'utils/cloudinary';
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
	let imageData = {};

	if (file) {
		try {
			const response = await uploadBuffer(Buffer.from(await file.arrayBuffer()), {
				folder: 'member',
			});

			imageData = {
				image: response.secure_url,
				imageId: response.public_id,
			};
		} catch (error) {
			return NextResponse.json({ code: 500, message: (error as Error).message });
		}
	}

	if (field('id')) {
		const detail = await prisma.member.findFirst({
			where: { id: field('id') },
		});

		if (!detail) {
			return NextResponse.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.member.update({
			where: { id: field('id') },
			data: {
				name: field('name'),
				dateOfBirth: dayjs(field('dateOfBirth')).toDate(),
				address: field('address'),
				phone: field('phone'),
				email: field('email'),
				updatedBy: session.user.id,
				...imageData,
			},
		});

		let deleteImage = null;

		if (file && detail.imageId) {
			deleteImage = await cloudinary.v2.api.delete_resources([detail.imageId]);
		}

		return NextResponse.json({ ...successResponse, data: { update, deleteImage } });
	}

	const create = await prisma.member.create({
		data: {
			name: field('name') as string,
			dateOfBirth: dayjs(field('dateOfBirth')).toDate(),
			address: field('address'),
			phone: field('phone'),
			email: field('email'),
			createdBy: session.user.id,
			...imageData,
		},
	});

	return NextResponse.json({ ...successResponse, data: create });
}
