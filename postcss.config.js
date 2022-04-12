const purgecss = [
	'@fullhuman/postcss-purgecss',
	{
		content: [
			'./node_modules/swiper/**/*.js',
			'./src/pages/**/*.{js,jsx,ts,tsx}',
			'./src/components/**/*.{js,jsx,ts,tsx}',
		],
		defaultExtractor: (content) => {
			const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
			const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

			return broadMatches.concat(innerMatches);
		},
		safelist: ['html', 'body', 'swiper', 'swiper-wrapper'],
	},
];

module.exports = {
	plugins: ['postcss-preset-env', 'tailwindcss', 'autoprefixer', purgecss],
};
