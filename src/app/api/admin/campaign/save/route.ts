import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';
import slugify from 'slugify';

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
		const response = await uploadBuffer(Buffer.from(await file.arrayBuffer()), {
			folder: 'campaign',
		});

		imageData = {
			image: response.secure_url,
			imageId: response.public_id,
		};
	}

	if (field('id')) {
		const detail = await prisma.campaign.findFirst({
			where: { id: field('id') },
		});

		if (!detail) {
			return NextResponse.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.campaign.update({
			where: { id: field('id') },
			data: {
				title: field('title'),
				startDate: field('startDate') ? dayjs(field('startDate')).toDate() : null,
				endDate: field('endDate') ? dayjs(field('endDate')).toDate() : null,
				desc: field('desc'),
				notes: field('notes'),
				status: field('status'),
				visible: field('visible'),
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

	const create = await prisma.campaign.create({
		data: {
			title: field('title') as string,
			slug: slugify(field('title') ?? '', { lower: true }),
			startDate: field('startDate') ? dayjs(field('startDate')).toDate() : null,
			endDate: field('endDate') ? dayjs(field('endDate')).toDate() : null,
			desc: field('desc') as string,
			notes: field('notes'),
			status: field('status'),
			visible: field('visible'),
			createdBy: session.user.id,
			...imageData,
		},
	});

	return NextResponse.json({ ...successResponse, data: create });
}
