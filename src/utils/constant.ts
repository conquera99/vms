export const DEFAULT_LIMIT = 10;

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
