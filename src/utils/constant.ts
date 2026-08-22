export const DEFAULT_LIMIT = 10;

export const SITE_URL = 'https://vsg.nunukan.net';
export const SITE_NAME = 'Vihara Sasana Graha Nunukan';
export const SITE_DESCRIPTION =
	'Situs resmi Vihara Sasana Graha (VSG) Nunukan — kabar dan kegiatan vihara, paritta suci, galeri dokumentasi, serta informasi umat Buddha di Kalimantan Utara.';

export const successResponse = {
	code: 0,
	message: 'success',
};

export const forbiddenResponse = {
	code: 403,
	message: 'forbidden access',
	data: [],
};

export const stillInUseResponse = {
	code: 501,
	message: 'data still in use in another record',
	data: [],
};

export const dateFormat = 'DD MMM YYYY';
export const datetimeFormat = 'DD MMM YYYY HH:mm';

export const successMessage = 'Successfully to save data!';
