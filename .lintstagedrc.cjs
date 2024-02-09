/** @type { import('lint-staged').ConfigFn } */
module.exports = function (stagedFiles) {
	const commands = [];

	const tsFiles = stagedFiles.filter(f => f.endsWith('.ts'));
	if (tsFiles.length > 0) {
		commands.push('tsc --noEmit');
		commands.push('eslint --fix ' + tsFiles.join(' '));
	}

	commands.push('prettier --write --ignore-unknown ' + stagedFiles.join(' '));

	return commands;
};
