import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id, title } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	const slug = slugify(title);

	if (id) {
		const update = await prisma.albums.update({
			where: { id },
			data: { title, slug, updatedBy: session.user.id },
		});

		revalidatePath(`/gallery/album/${slug}`);

		return NextResponse.json({ ...successResponse, data: update });
	}

	const create = await prisma.albums.create({
		data: { title, slug, createdBy: session.user.id },
	});

	revalidatePath(`/gallery/album/${slug}`);

	return NextResponse.json({ ...successResponse, data: create });
}
