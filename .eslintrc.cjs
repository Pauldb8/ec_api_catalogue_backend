/** @type { import('eslint').Linter.Config } */
const config = {
	$schema: 'https://json.schemastore.org/eslintrc.json',
	root: true,
	env: {
		node: true,
		es2023: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	overrides: [{ files: ['src/**/*.ts'], parserOptions: { project: 'tsconfig.json' }, extends: ['plugin:@typescript-eslint/recommended-type-checked'] }],
	rules: {
		'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
	},
};

module.exports = config;
