/** @type { import('prettier').Config } */
const config = {
	$schema: 'https://json.schemastore.org/prettierrc.json',
	printWidth: 256,
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: true,
	quoteProps: 'consistent',
	jsxSingleQuote: true,
	trailingComma: 'es5',
	bracketSpacing: true,
	bracketSameLine: true,
	arrowParens: 'avoid',
	endOfLine: 'crlf',
};

module.exports = config;
