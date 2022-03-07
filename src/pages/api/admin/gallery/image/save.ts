import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';

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

	// for update
	if (data?.fields.id) {
		const detail = await prisma.images.findFirst({
			where: { id: data?.fields.id },
		});

		if (!detail) {
			return res.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.images.update({
			where: { id: data?.fields.id },
			data: {
				altText: data?.fields.altText,
				albumId: data?.fields.albumId,
				updatedBy: session.user.id,
			},
		});

		return res.json({ ...successResponse, data: update });
	}

	// upload
	if (file) {
		const response = await cloudinary.v2.uploader.upload(file, { folder: 'gallery' });

		const create = await prisma.images.create({
			data: {
				id: response.public_id,
				image: response.secure_url,
				altText: data?.fields.altText,
				albumId: data?.fields.albumId,
				createdBy: session.user.id,
			},
		});

		return res.json({ ...successResponse, data: create });
	}

	return res.json({ code: 500, message: 'gambar wajib diisi' });
}
