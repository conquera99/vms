import { NextRequest, NextResponse } from 'next/server';

import { getSession } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, stillInUseResponse, successResponse } from 'utils/constant';
import { SYSADM_ID } from 'utils/account';

export async function POST(request: NextRequest) {
	const { id } = await request.json();

	const session = await getSession();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	// deleting a user also deletes their accounts and sessions
	if (id && id !== SYSADM_ID) {
		const update = await prisma.user.delete({
			where: { id },
		});

		return NextResponse.json({ ...successResponse, data: update });
	}

	return NextResponse.json({ code: 500, message: 'id is required' });
}
