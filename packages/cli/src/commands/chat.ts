import { Command } from 'commander';
import { isAlphanumeric, isLength, isUUID } from 'validator';
import { v4 } from 'uuid';

import { chats, account } from './storages';
import { ActionError } from './errors';
import { error, validator } from './middlewares';

const accountValidator = validator(async () => {
	if (!(await account.exists())) throw new ActionError('Account is missing');
});

const nameValidator = validator(async (name: string) => {
	if (!isAlphanumeric(name))
		throw new ActionError('Name must contain only letters and numbers');
	if (!isLength(name, { min: 4, max: 20 }))
		throw new ActionError('Name must be between 4 and 20 character long');
});

const idValidator = validator(async (_, id: string) => {
	if (!isUUID(id)) throw new ActionError('Id must be a UUID');
});

const command = new Command('chat').description('Manage chats').action(
	error(
		accountValidator(async () => {
			const data = (await chats.exists()) ? await chats.get() : {};
			const items = Object.keys(data).map((name) => ({ name, id: data[name] }));

			if (items.length === 0) throw new ActionError('There are no chats');

			console.table(items);
		}),
	),
);

command
	.command('new')
	.description('Create new chat')
	.argument('<name>', 'chat name')
	.action(
		error(
			accountValidator(
				nameValidator(async (name) => {
					const data = (await chats.exists()) ? await chats.get() : {};
					if (data[name]) throw new ActionError(`Chat already exists`);

					data[name] = v4();
					await chats.set(data);

					console.log(`Chat ID: ${data[name]}`);
				}),
			),
		),
	);

command
	.command('rm')
	.description('Remove chat')
	.argument('<name>', 'chat name')
	.action(
		error(
			accountValidator(
				nameValidator(async (name) => {
					const data = (await chats.exists()) ? await chats.get() : {};
					if (!data[name]) throw new ActionError(`Chat doesn't exist`);

					delete data[name];
					await chats.set(data);

					console.log('Chat was removed successfully');
				}),
			),
		),
	);

command
	.command('get')
	.description('Get chat')
	.argument('<name>', 'chat name')
	.action(
		error(
			accountValidator(
				nameValidator(async (name) => {
					const data = (await chats.exists()) ? await chats.get() : {};
					if (!data[name]) throw new ActionError(`Chat doesn't exist`);

					console.log(data[name]);
				}),
			),
		),
	);

command
	.command('set')
	.description('Set chat')
	.argument('<name>', 'chat name')
	.argument('<id>', 'chat ID')
	.action(
		error(
			accountValidator(
				nameValidator(
					idValidator(async (name, id) => {
						const data = (await chats.exists()) ? await chats.get() : {};
						if (data[name]) throw new ActionError(`Chat already exists`);

						data[name] = id;
						await chats.set(data);

						console.log('Chat was set successfully');
					}),
				),
			),
		),
	);

command
	.command('connect')
	.description('Connect to chat')
	.argument('<name>', 'chat name')
	.action(
		error(
			accountValidator(
				nameValidator(async (name) => {
					const data = (await chats.exists()) ? await chats.get() : {};
					if (!data[name]) throw new ActionError(`Chat doesn't exist`);

					console.log(`Connecting...`);
				}),
			),
		),
	);

export { command };
