import { Command } from 'commander';

import { account } from './storages.js';
import { use, error, accountValidator, nameValidator } from './middlewares.js';

const command = new Command('account').description('Manage user account').action(
	use(
		error,
		accountValidator,
	)(async () => {
		const { name } = await account.get();

		console.log(`Name: ${name}`);
	}),
);

command
	.command('set')
	.description('Set the name of the user')
	.argument('<name>', 'user name')
	.action(
		use(
			error,
			nameValidator,
		)(async (name) => {
			await account.set({ name });

			console.log(`Account name was set successfully`);
		}),
	);

export { command };
