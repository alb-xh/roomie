import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from 'commander';

import { accountCommand, chatCommand } from './commands/index.js';

const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf-8'));

new Command()
	.name(pkg.name)
	.description(pkg.description)
	.version(pkg.version)
	.addCommand(accountCommand)
	.addCommand(chatCommand)
	.parse();
