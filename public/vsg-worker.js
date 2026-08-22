const CACHE_NAME = 'vsg-pwa-v3';
const PARITTA_TRACKS = [
	'/sounds/paritta/01-namakara-gatha.mp4',
	'/sounds/paritta/02-puja-gatha.mp4',
	'/sounds/paritta/03-pubbabhaganamakara.mp4',
	'/sounds/paritta/04-saranagamana-patha.mp4',
	'/sounds/paritta/05-pancasila.mp4',
	'/sounds/paritta/06-buddhanussati.mp4',
	'/sounds/paritta/07-dhammanussati.mp4',
	'/sounds/paritta/08-sanghanussati.mp4',
	'/sounds/paritta/09-saccakiriya-gatha.mp4',
	'/sounds/paritta/10-mangala-sutta.mp4',
	'/sounds/paritta/11-karaniya-metta-sutta.mp4',
	'/sounds/paritta/12-brahmavihara-pharana.mp4',
	'/sounds/paritta/13-abhinhapaccavekkahana.mp4',
	'/sounds/paritta/14-aradhana-tisarana-pancasila.mp4',
	'/sounds/paritta/15-aradhana-dhammadesana.mp4',
	'/sounds/paritta/16-ettavatta.mp4',
];
const APP_SHELL = ['/', '/paritta', '/manifest.json', '/favicon.ico', ...PARITTA_TRACKS];
// Pages whose HTML is precached; their build-time subresources are cached too,
// so a page works offline even if it was never opened while online.
const PRECACHED_PAGES = ['/', '/paritta'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// Collects same-origin asset URLs (scripts, styles, images) referenced by cached page HTML.
const collectPageAssets = async (cache) => {
	const assetUrls = new Set();

	await Promise.all(
		PRECACHED_PAGES.map(async (pageUrl) => {
			const response = await cache.match(pageUrl);
			if (!response) {
				return;
			}

			const html = await response.clone().text();
			const attributePattern = /(?:src|href)="([^"]+)"/g;
			let match;

			while ((match = attributePattern.exec(html))) {
				const url = match[1];

				if (
					url.startsWith('/_next/static/') ||
					url.startsWith('/images/') ||
					url === '/logo.png' ||
					url.startsWith('/icons/')
				) {
					assetUrls.add(url);
				}
			}
		}),
	);

	return [...assetUrls];
};

// Serves a 206 Partial Content response sliced from a fully cached resource,
// as expected by <audio>/<video> elements that send Range headers.
const buildRangeResponse = async (request, cachedResponse) => {
	const blob = await cachedResponse.blob();
	const total = blob.size;
	const rangeHeader = request.headers.get('range') || '';
	const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);

	let start = match ? Number(match[1]) : 0;
	let end = match && match[2] ? Number(match[2]) : total - 1;

	if (!Number.isFinite(start) || start < 0) {
		start = 0;
	}
	if (start >= total) {
		return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${total}` } });
	}
	if (!Number.isFinite(end) || end >= total) {
		end = total - 1;
	}

	const chunk = blob.slice(start, end + 1);

	return new Response(chunk, {
		status: 206,
		statusText: 'Partial Content',
		headers: {
			'Content-Type': cachedResponse.headers.get('Content-Type') || 'application/octet-stream',
			'Content-Range': `bytes ${start}-${end}/${total}`,
			'Content-Length': String(end - start + 1),
			'Accept-Ranges': 'bytes',
		},
	});
};

const cacheFirstWithRefresh = (event) => {
	const { request } = event;

	event.respondWith(
		caches.match(request).then((cachedResponse) => {
			const networkResponse = fetch(request)
				.then((response) => {
					if (response.ok) {
						const responseClone = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
					}
					return response;
				})
				.catch(() => cachedResponse);

			return cachedResponse || networkResponse;
		}),
	);
};

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(async (cache) => {
				await Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => undefined)));

				const pageAssets = await collectPageAssets(cache);
				await Promise.all(pageAssets.map((url) => cache.add(url).catch(() => undefined)));
			})
			.catch(() => undefined),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((cacheName) => cacheName !== CACHE_NAME)
					.map((cacheName) => caches.delete(cacheName)),
			);
		}),
	);

	self.clients.claim();
});

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('fetch', (event) => {
	const { request } = event;

	if (request.method !== 'GET') {
		return;
	}

	const requestUrl = new URL(request.url);

	if (FONT_HOSTS.includes(requestUrl.hostname)) {
		event.respondWith(
			caches.open(CACHE_NAME).then((cache) =>
				cache.match(request).then(
					(cachedResponse) =>
						cachedResponse ||
						fetch(request).then((response) => {
							if (response.ok || response.type === 'opaque') {
								cache.put(request, response.clone());
							}
							return response;
						}),
				),
			),
		);
		return;
	}

	if (requestUrl.origin !== self.location.origin) {
		return;
	}

	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response.ok) {
						const responseClone = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
					}
					return response;
				})
				.catch(async () => {
					const cachedResponse = await caches.match(request);
					if (cachedResponse) {
						return cachedResponse;
					}

					return caches.match('/paritta').then((fallback) => fallback || caches.match('/'));
				}),
		);
		return;
	}

	// React Server Component payloads power client-side navigations; serving
	// them from cache keeps the router working offline after a prefetch.
	if (request.headers.get('RSC') === '1' || request.headers.get('Next-Router-Prefetch') === '1') {
		cacheFirstWithRefresh(event);
		return;
	}

	const isParittaSound = requestUrl.pathname.startsWith('/sounds/paritta/');

	if (request.headers.has('range') && (isParittaSound || request.destination === 'audio' || request.destination === 'video')) {
		event.respondWith(
			caches.match(request, { ignoreVary: true }).then(async (cachedResponse) => {
				if (cachedResponse) {
					return buildRangeResponse(request, cachedResponse);
				}

				return fetch(request);
			}),
		);
		return;
	}

	if (
		['style', 'script', 'image', 'font', 'audio', 'video'].includes(request.destination) ||
		isParittaSound
	) {
		cacheFirstWithRefresh(event);
	}
});
