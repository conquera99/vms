import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) return Response.json(forbiddenResponse, { status: 403 });

	const body = await request.json();
	const { locId, itemId, ...data } = body;

	const existing = await prisma.itemLocation.findFirst({
		where: { locId, itemId },
	});

	if (existing) {
		const updated = await prisma.itemLocation.update({
			where: { locId_itemId: { locId, itemId } },
			data: { ...data, updatedBy: session.user.id },
		});
		return Response.json({ ...successResponse, data: updated });
	}

	const created = await prisma.itemLocation.create({
		data: { locId, itemId, ...data, createdBy: session.user.id },
	});
	return Response.json({ ...successResponse, data: created });
}
