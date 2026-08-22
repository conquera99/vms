import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { auth } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';

export async function POST(request: NextRequest) {
	const { id, name, username, password, email, access } = await request.json();

	const session = await auth();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	let encryptedPassword = '';

	if (!id && !password) return NextResponse.json({ code: 500, message: 'password wajib diisi' });

	if (password) {
		const salt = bcrypt.genSaltSync(10);
		encryptedPassword = bcrypt.hashSync(password, salt);
	}

	if (id) {
		const updatedData: Record<string, any> = {
			name,
			username,
			password: undefined,
			email,
			updatedBy: session.user.id,
		};

		if (password) {
			updatedData.password = encryptedPassword;
		}

		let permissionData = [];

		// revert permission to N
		const revertPermission = await prisma.userPermissions.deleteMany({
			where: { userId: id },
		});

		if (access.length > 0) {
			for (let i = 0; i < access.length; i++) {
				permissionData.push({
					name: access[i],
					userId: id,
					access: 'Y',
					createdBy: session.user.id,
				});
			}
		}

		const [update, savePermissions] = await prisma.$transaction([
			prisma.user.update({ where: { id }, data: updatedData }),
			prisma.userPermissions.createMany({ data: permissionData }),
		]);

		return NextResponse.json({
			...successResponse,
			data: { revertPermission, update, savePermissions },
		});
	}

	const create = await prisma.user.create({
		data: { name, username, password: encryptedPassword, email, createdBy: session.user.id },
	});

	return NextResponse.json({ ...successResponse, data: create });
}
