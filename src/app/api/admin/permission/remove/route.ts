import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { name } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (name) {
		const update = await prisma.permissions.delete({
			where: { name },
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	return NextResponse.json({ code: 500, message: 'name is required' });
}
