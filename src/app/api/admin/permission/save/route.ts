import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) return Response.json(forbiddenResponse, { status: 403 });

	const body = await request.json();
	const { name, ...data } = body;

	if (name) {
		const updated = await prisma.permissions.update({
			where: { name },
			data,
		});
		return Response.json({ ...successResponse, data: updated });
	}

	const created = await prisma.permissions.create({
		data,
	});
	return Response.json({ ...successResponse, data: created });
}
