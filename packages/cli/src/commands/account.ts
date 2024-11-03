import { Command } from 'commander';

import { account } from './storages';
import { ActionError } from './errors';
import { use, error, accountValidator, nameValidator } from './middlewares';

const command = new Command('account').description('Manage user account').action(
	use(
		error,
		accountValidator,
	)(async () => {
		if (!(await account.exists())) throw new ActionError('Please set the account first!');

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
