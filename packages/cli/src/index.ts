import { Command } from 'commander';

import pkg from '../package.json';
import { accountCommand, chatCommand } from './commands';

new Command().name(pkg.name).description(pkg.description).version(pkg.version).addCommand(accountCommand).addCommand(chatCommand).parse();
