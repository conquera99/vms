import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id, name } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (id) {
		const update = await prisma.itemCategory.update({
			where: { id },
			data: { name, updatedBy: session.user.id },
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	const code: Record<string, string>[] | undefined =
		await prisma.$queryRaw`SELECT LPAD(IFNULL(MAX(ic_code), 0)+1, 4, '0') as 'seq' from item_categories`;

	const create = await prisma.itemCategory.create({
		data: { name, code: code?.[0]?.seq as string, createdBy: session.user.id },
	});

	return NextResponse.json({ ...successResponse, data: create });
}
