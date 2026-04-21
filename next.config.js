const compilerOptions = {
	removeConsole: {
		exclude: ['error'],
	},
};


/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
	},
	reactStrictMode: false,
	poweredByHeader: false,
	productionBrowserSourceMaps: true,
	compiler: process.env.NODE_ENV === 'production' ? compilerOptions : {},
};

module.exports = nextConfig;
