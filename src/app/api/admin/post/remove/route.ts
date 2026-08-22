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
		const detail = await prisma.posts.findFirst({
			where: { id },
		});

		if (!detail) {
			return NextResponse.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.posts.delete({
			where: { id },
		});

		let deleteImage = null;

		if (detail.imageId) {
			deleteImage = await cloudinary.v2.api.delete_resources([detail.imageId]);
		}

		return NextResponse.json({ ...successResponse, data: { update, deleteImage } });
	}

	return NextResponse.json({ code: 500, message: 'id is required' });
}
