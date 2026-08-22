import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { auth } from 'auth';
import { prisma } from 'db';
import { DEFAULT_LIMIT, forbiddenResponse, successResponse } from 'utils/constant';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const p = searchParams.get('p');
	const s = searchParams.get('s');
	const id = searchParams.get('id');

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	// for detail
	if (id) {
		const data = await prisma.deceased.findFirst({ where: { id } });

		return NextResponse.json({ ...successResponse, data });
	}

	//for list
	const page = Number(p || 1);
	const limit = Number(s || DEFAULT_LIMIT);

	const data = await prisma.deceased.findMany({
		skip: (Number(page) - 1) * Number(limit),
		take: Number(limit),
		orderBy: { createdAt: 'desc' },
	});

	const newData = [];

	for (let i = 0; i < data.length; i++) {
		const payload = `${data[i].imageId}/${data[i].image?.split('/').pop()}`;

		const key = crypto
			.createHash('sha1')
			.update(`/${payload}${process.env.CLOUDINARY_API_SECRET}`)
			.digest('base64');

		newData.push({
			...data[i],
			url: `https://res.cloudinary.com/vihara-sasana-graha/image/upload/${key}/${payload}`,
		});
	}

	return NextResponse.json({ ...successResponse, data: newData });
}
