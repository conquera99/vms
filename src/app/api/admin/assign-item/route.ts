import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) return Response.json(forbiddenResponse, { status: 403 });

	const searchParams = request.nextUrl.searchParams;
	const p = searchParams.get('p');
	const s = searchParams.get('s');
	const locId = searchParams.get('locId');
	const itemId = searchParams.get('itemId');

	if (locId && itemId) {
		const data = await prisma.itemLocation.findFirst({
			where: { locId, itemId },
		});
		return Response.json({ ...successResponse, data });
	}

	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);
	const data = await prisma.itemLocation.findMany({
		skip: (page - 1) * limit,
		take: limit,
		orderBy: { createdAt: 'desc' },
	});
	return Response.json({ ...successResponse, data });
}
