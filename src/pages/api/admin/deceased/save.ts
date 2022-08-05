import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import dayjs from 'dayjs';

import { prisma } from 'db';
import { forbiddenResponse, successResponse } from 'utils/constant';
import cloudinary from 'utils/cloudinary';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	if (!session) return res.status(403).json(forbiddenResponse);

	const data: { fields: Record<string, any>; files: any } | undefined = await new Promise(
		(resolve, reject) => {
			const form = new IncomingForm();

			form.parse(req, (err, fields, files) => {
				if (err) return reject(err);
				resolve({ fields, files });
			});
		},
	);

	const file = data?.files?.img?.filepath;

	// upload
	let imageData = {};

	if (file) {
		try {
			const response = await cloudinary.v2.uploader.upload(file, { folder: 'deceased' });

			imageData = {
				image: response.secure_url,
				imageId: response.public_id,
			};
		} catch (error) {
			return res.json({ code: 500, message: (error as Record<string, any>).message });
		}
	}

	if (data?.fields.id) {
		const detail = await prisma.deceased.findFirst({
			where: { id: data?.fields.id },
		});

		if (!detail) {
			return res.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.deceased.update({
			where: { id: data?.fields.id },
			data: {
				name: data?.fields.name,
				placeOfBirth: data?.fields.placeOfBirth,
				placeOfDeath: data?.fields.placeOfDeath,
				notes: data?.fields.notes,
				dateOfBirth: dayjs(data?.fields.dateOfBirth).toDate(),
				dateOfDeath: dayjs(data?.fields.dateOfDeath).toDate(),
				updatedBy: session.user.id,
				...imageData,
			},
		});

		let deleteImage = null;

		if (file && detail.imageId) {
			deleteImage = await cloudinary.v2.api.delete_resources([detail.imageId]);
		}

		return res.json({ ...successResponse, data: { update, deleteImage } });
	}

	const create = await prisma.deceased.create({
		data: {
			name: data?.fields.name,
			placeOfBirth: data?.fields.placeOfBirth,
			placeOfDeath: data?.fields.placeOfDeath,
			notes: data?.fields.notes,
			dateOfBirth: dayjs(data?.fields.dateOfBirth).toDate(),
			dateOfDeath: dayjs(data?.fields.dateOfDeath).toDate(),
			createdBy: session.user.id,
			...imageData,
		},
	});

	return res.json({ ...successResponse, data: create });
}
