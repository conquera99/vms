import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { name } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	const detail = await prisma.permissions.findUnique({ where: { name } });

	if (detail) {
		const update = await prisma.permissions.update({
			where: { name },
			data: { name },
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	const create = await prisma.permissions.create({
		data: { name },
	});

	return NextResponse.json({ ...successResponse, data: create });
}
