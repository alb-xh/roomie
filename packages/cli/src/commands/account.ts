import { Command } from 'commander';
import { isAlphanumeric, isLength } from 'validator';

import { account } from './storages';
import { ActionError } from './errors';
import { error, validator } from './middlewares';

const nameValidator = validator(async (name: string) => {
	if (!isAlphanumeric(name))
		throw new ActionError('Name must contain only letters and numbers');
	if (!isLength(name, { min: 4, max: 20 }))
		throw new ActionError('Name must be between 4 and 20 character long');
});

const command = new Command('account')
	.description('Manage user account')
	.action(
		error(async () => {
			if (!(await account.exists()))
				throw new ActionError('Please set the account first!');

			const { name } = await account.get();

			console.log(`Name: ${name}`);
		}),
	);

command
	.command('set')
	.description('Set the name of the user')
	.argument('<name>', 'user name')
	.action(
		error(
			nameValidator(async (name) => {
				await account.set({ name });

				console.log(`Account name was set successfully`);
			}),
		),
	);

export { command };
