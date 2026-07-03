import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) return Response.json(forbiddenResponse, { status: 403 });

	const body = await request.json();
	const { id, ...data } = body;

	if (id) {
		const updated = await prisma.location.update({
			where: { id },
			data: { ...data, updatedBy: session.user.id },
		});
		return Response.json({ ...successResponse, data: updated });
	}

	const created = await prisma.location.create({
		data: { ...data, createdBy: session.user.id },
	});
	return Response.json({ ...successResponse, data: created });
}
