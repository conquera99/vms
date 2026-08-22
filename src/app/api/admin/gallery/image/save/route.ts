import { NextRequest, NextResponse } from 'next/server';

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

	// for update
	if (field('id')) {
		const detail = await prisma.images.findFirst({
			where: { id: field('id') },
		});

		if (!detail) {
			return NextResponse.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.images.update({
			where: { id: field('id') },
			data: {
				altText: field('altText'),
				albumId: field('albumId'),
				updatedBy: session.user.id,
			},
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	// upload
	if (file) {
		try {
			const response = await uploadBuffer(Buffer.from(await file.arrayBuffer()), {
				folder: 'gallery',
			});

			const create = await prisma.images.create({
				data: {
					id: response.public_id,
					image: response.secure_url,
					altText: field('altText'),
					albumId: field('albumId') as string,
					createdBy: session.user.id,
				},
			});

			return NextResponse.json({ ...successResponse, data: create });
		} catch (error) {
			return NextResponse.json({ code: 500, message: (error as Error).message });
		}
	}

	return NextResponse.json({ code: 500, message: 'gambar wajib diisi' });
}
