export default async function listFetcher<JSON = any>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const res = await fetch(input, init);
	const json = await res.json();

	return json.data;
}

export async function actionFetcher<JSON = any>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const res = await fetch(input, init);
	const json = await res.json();

	return json;
}
