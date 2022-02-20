const withPWA = require('next-pwa');

const runtimeCaching = require('next-pwa/cache');
runtimeCaching[0].handler = 'StaleWhileRevalidate';

module.exports = withPWA({
	pwa: {
		dest: 'public',
		disable: process.env.NODE_ENV === 'development',
		register: true,
		scope: '/',
		sw: 'vsg-worker.js',
		skipWaiting: false,
		runtimeCaching,
	},
	reactStrictMode: false,
	poweredByHeader: false,
	productionBrowserSourceMaps: true,
	swcMinify: true,
});
