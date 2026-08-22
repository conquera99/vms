import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const p = searchParams.get('p');
	const s = searchParams.get('s');
	const id = searchParams.get('id');

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	// for detail
	if (id) {
		const data = await prisma.user.findFirst({ where: { id } });

		const permissions = await prisma.userPermissions.findMany({
			where: { userId: id },
		});

		const permissionsData = permissions?.map((item) => item.name);

		return NextResponse.json({ ...successResponse, data, permissions: permissionsData });
	}

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const data = await prisma.user.findMany({
		skip: (Number(page) - 1) * Number(limit),
		take: Number(limit),
		orderBy: { createdAt: 'desc' },
	});

	return NextResponse.json({ ...successResponse, data });
}
