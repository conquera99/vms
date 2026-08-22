import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
			folder: 'posts',
		});

		imageData = {
			image: response.secure_url,
			imageId: response.public_id,
		};
	}

	const slug = slugify(field('title') ?? '');

	if (field('id')) {
		const detail = await prisma.posts.findFirst({
			where: { id: field('id') },
		});

		if (!detail) {
			return NextResponse.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.posts.update({
			where: { id: field('id') },
			data: {
				slug,
				title: field('title'),
				summary: field('summary'),
				keywords: field('keywords'),
				content: field('content'),
				status: field('status'),
				updatedBy: session.user.id,
				...imageData,
			},
		});

		let deleteImage = null;

		if (file && detail.imageId) {
			deleteImage = await cloudinary.v2.api.delete_resources([detail.imageId]);
		}

		revalidatePath(`/post/${slug}`);

		return NextResponse.json({ ...successResponse, data: { update, deleteImage } });
	}

	const create = await prisma.posts.create({
		data: {
			slug,
			title: field('title') as string,
			summary: field('summary'),
			keywords: field('keywords'),
			content: field('content') as string,
			status: field('status'),
			createdBy: session.user.id,
			...imageData,
		},
	});

	revalidatePath(`/post/${slug}`);

	return NextResponse.json({ ...successResponse, data: create });
}
