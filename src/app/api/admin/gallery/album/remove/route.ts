import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (id) {
		const images = await prisma.images.findMany({ where: { albumId: id } });

		if (images.length > 0) {
			return NextResponse.json({ ...stillInUseResponse });
		}

		const remove = await prisma.albums.delete({
			where: { id },
		});

		return NextResponse.json({ ...successResponse, data: remove });
	}

	return NextResponse.json({ code: 500, message: 'id is required' });
}
