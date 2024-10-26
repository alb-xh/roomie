import { Command } from 'commander';

import pkg from '../package.json';
import { accountCommand } from './commands';

new Command()
	.name(pkg.name)
	.description(pkg.description)
	.version(pkg.version)
	.addCommand(accountCommand)
	.parse();
