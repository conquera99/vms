import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { getSession } from 'auth';
import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';
import { placeholderEmail, SYSADM_ID } from 'utils/account';

export async function POST(request: NextRequest) {
	const { id, name, username, password, email, access } = await request.json();

	const session = await getSession();

	if (!session) return NextResponse.json(forbiddenResponse, { status: 403 });

	let encryptedPassword = '';

	if (id === SYSADM_ID || username === SYSADM_ID) {
		return NextResponse.json({ code: 500, message: 'username sysadm tidak dapat digunakan' });
	}

	if (email) {
		const emailOwner = await prisma.user.findUnique({ where: { email } });

		if (emailOwner && emailOwner.id !== id) {
			return NextResponse.json({ code: 500, message: 'email sudah digunakan' });
		}
	}

	if (!id && !password) return NextResponse.json({ code: 500, message: 'password wajib diisi' });

	if (password) {
		const salt = bcrypt.genSaltSync(10);
		encryptedPassword = bcrypt.hashSync(password, salt);
	}

	if (id) {
		const updatedData: Record<string, any> = {
			name,
			username,
			email: email || placeholderEmail(id),
			updatedBy: session.user.id,
		};

		if (password) {
			await prisma.account.upsert({
				where: { providerId_accountId: { providerId: 'credential', accountId: id } },
				update: { password: encryptedPassword },
				create: {
					id: randomUUID(),
					userId: id,
					accountId: id,
					providerId: 'credential',
					password: encryptedPassword,
				},
			});
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

	const userId = randomUUID();

	const create = await prisma.user.create({
		data: {
			id: userId,
			name,
			username,
			email: email || placeholderEmail(userId),
			createdBy: session.user.id,
			accounts: {
				create: {
					id: randomUUID(),
					accountId: userId,
					providerId: 'credential',
					password: encryptedPassword,
				},
			},
		},
	});

	return NextResponse.json({ ...successResponse, data: create });
}
