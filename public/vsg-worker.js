const CACHE_NAME = 'vsg-pwa-v2';
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

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(APP_SHELL);
		}),
	);

	self.skipWaiting();
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

self.addEventListener('fetch', (event) => {
	const { request } = event;

	if (request.method !== 'GET') {
		return;
	}

	const requestUrl = new URL(request.url);

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

					return caches.match('/');
				}),
		);
		return;
	}

	if (
		['style', 'script', 'image', 'font', 'audio', 'video'].includes(request.destination) ||
		requestUrl.pathname.startsWith('/sounds/paritta/')
	) {
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
	}
});
