import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) return Response.json(forbiddenResponse, { status: 403 });

	const { id } = await request.json();
	await prisma.deceased.delete({ where: { id } });
	return Response.json(successResponse);
}
