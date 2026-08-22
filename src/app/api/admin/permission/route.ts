import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const p = searchParams.get('p');
	const s = searchParams.get('s');
	const name = searchParams.get('name');

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	// for detail
	if (name) {
		const data = await prisma.permissions.findFirst({ where: { name } });

		return NextResponse.json({ ...successResponse, data });
	}

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const data = await prisma.permissions.findMany({
		skip: (Number(page) - 1) * Number(limit),
		take: Number(limit),
		orderBy: { createdAt: 'desc' },
	});

	return NextResponse.json({ ...successResponse, data });
}
