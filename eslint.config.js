const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = [
	...nextCoreWebVitals,
	{
		files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
		rules: {
			'@next/next/no-img-element': 'off',
			'react-hooks/immutability': 'off',
			'react-hooks/set-state-in-effect': 'off',
		},
	},
	{
		ignores: ['coverage/**', 'src/generated/**'],
	},
	prettierConfig,
];
