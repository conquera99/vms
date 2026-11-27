import { NextRequest, NextResponse } from 'next/server';

import { getSession } from 'auth';
import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';
import { publicEmail, SYSADM_ID } from 'utils/account';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const p = searchParams.get('p');
	const s = searchParams.get('s');
	const id = searchParams.get('id');

	const session = await getSession();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	// for detail
	if (id) {
		const user = await prisma.user.findFirst({ where: { id } });
		const data = user && { ...user, email: publicEmail(user.email) };

		const permissions = await prisma.userPermissions.findMany({
			where: { userId: id },
		});

		const permissionsData = permissions?.map((item) => item.name);

		return NextResponse.json({ ...successResponse, data, permissions: permissionsData });
	}

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const users = await prisma.user.findMany({
		// the hardcoded sysadm row is not a manageable user
		where: { id: { not: SYSADM_ID } },
		skip: (Number(page) - 1) * Number(limit),
		take: Number(limit),
		orderBy: { createdAt: 'desc' },
	});

	const data = users.map((user) => ({ ...user, email: publicEmail(user.email) }));

	return NextResponse.json({ ...successResponse, data });
}
