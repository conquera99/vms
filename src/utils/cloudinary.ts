import cloudinary from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_USER_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadBuffer(
	buffer: Buffer,
	options: { folder: string; type?: 'authenticated' | 'upload' },
): Promise<UploadApiResponse> {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.v2.uploader.upload_stream(options, (error, result) => {
			if (error || !result) return reject(error);
			resolve(result);
		});

		stream.end(buffer);
	});
}

export default cloudinary;
