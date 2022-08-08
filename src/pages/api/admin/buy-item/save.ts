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
	let upload;
	
	if(file) {
		upload = await cloudinary.v2.uploader.upload(file, { folder: 'item' });
	}

	const [create, updateItem] = await prisma.$transaction([
		prisma.itemHistory.create({
			data: {
				itemId: data?.fields.itemId,
				date: dayjs(data?.fields.date).toDate(),
				qty: data?.fields.qty,
				price: data?.fields.price,
				image: upload?.secure_url,
				imageId: upload?.public_id,
				createdBy: session.user.id,
			},
		}),
		prisma.item.updateMany({
			where: { id: data?.fields.itemId },
			data: { totalQty: { increment: data?.fields.qty } },
		}),
	]);

	return res.json({ ...successResponse, data: { create, updateItem, upload } });
}
