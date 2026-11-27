import { NextRequest, NextResponse } from 'next/server';

import { getSession } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id } = await request.json();

	const session = await getSession();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (id) {
		const item = await prisma.item.findMany({ where: { categoryId: id } });

		if (item.length > 0) {
			return NextResponse.json({ ...stillInUseResponse });
		}

		const update = await prisma.itemCategory.delete({
			where: { id },
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	return NextResponse.json({ code: 500, message: 'id is required' });
}
