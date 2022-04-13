import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import dayjs from 'dayjs';
import slugify from 'slugify';

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
		const response = await cloudinary.v2.uploader.upload(file, { folder: 'campaign' });

		imageData = {
			image: response.secure_url,
			imageId: response.public_id,
		};
	}

	if (data?.fields.id) {
		const detail = await prisma.campaign.findFirst({
			where: { id: data?.fields.id },
		});

		if (!detail) {
			return res.json({ code: 404, message: 'data not found' });
		}

		const update = await prisma.campaign.update({
			where: { id: data?.fields.id },
			data: {
				title: data?.fields.title,
				startDate: data?.fields.startDate ? dayjs(data?.fields.startDate).toDate() : null,
				endDate: data?.fields.endDate ? dayjs(data?.fields.endDate).toDate() : null,
				desc: data?.fields.desc,
				notes: data?.fields.notes,
				status: data?.fields.status,
				visible: data?.fields.visible,
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

	const create = await prisma.campaign.create({
		data: {
			title: data?.fields.title,
			slug: slugify(data?.fields.title, { lower: true }),
			startDate: data?.fields.startDate ? dayjs(data?.fields.startDate).toDate() : null,
			endDate: data?.fields.endDate ? dayjs(data?.fields.endDate).toDate() : null,
			desc: data?.fields.desc,
			notes: data?.fields.notes,
			status: data?.fields.status,
			visible: data?.fields.visible,
			createdBy: session.user.id,
			...imageData,
		},
	});

	return res.json({ ...successResponse, data: create });
}
