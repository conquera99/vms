import { NextRequest, NextResponse } from 'next/server';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id, name, categoryId, desc } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	if (id) {
		const update = await prisma.item.update({
			where: { id },
			data: { name, categoryId, updatedBy: session.user.id },
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	// get item category by id
	const itemCategory = await prisma.itemCategory.findUnique({ where: { id: categoryId } });

	const prefixLength = Number(itemCategory?.code.length) + 2;

	const code: Record<string, string>[] | undefined =
		await prisma.$queryRaw`SELECT LPAD(IFNULL(MAX(SUBSTR(item_code, ${prefixLength})), 0)+1, 6, '0') as 'seq' from items`;

	const create = await prisma.item.create({
		data: {
			name,
			code: `${itemCategory?.code}.${code?.[0]?.seq as string}`,
			categoryId,
			desc,
			createdBy: session.user.id,
		},
	});

	return NextResponse.json({ ...successResponse, data: create });
}
