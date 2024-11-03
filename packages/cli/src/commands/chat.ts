import { Command } from 'commander';
import { v4 } from 'uuid';

import { chats } from './storages';
import { ActionError } from './errors';
import { use, error, accountValidator, nameValidator, idValidator } from './middlewares';
import { socket } from './socket';

const command = new Command('chat').description('Manage chats').action(
	use(
		error,
		accountValidator,
	)(async () => {
		const data = (await chats.exists()) ? await chats.get() : {};
		const items = Object.keys(data).map((name) => ({ name, id: data[name] }));

		if (items.length === 0) throw new ActionError('There are no chats');

		console.table(items);
	}),
);

command
	.command('new')
	.description('Create new chat')
	.argument('<name>', 'chat name')
	.action(
		use(
			error,
			accountValidator,
			nameValidator,
		)(async (name) => {
			const data = (await chats.exists()) ? await chats.get() : {};
			if (data[name]) throw new ActionError(`Chat already exists`);

			data[name] = v4();
			await chats.set(data);

			console.log(`Chat ID: ${data[name]}`);
		}),
	);

command
	.command('rm')
	.description('Remove chat')
	.argument('<name>', 'chat name')
	.action(
		use(
			error,
			accountValidator,
			nameValidator,
		)(async (name) => {
			const data = (await chats.exists()) ? await chats.get() : {};
			if (!data[name]) throw new ActionError(`Chat doesn't exist`);

			delete data[name];
			await chats.set(data);

			console.log('Chat was removed successfully');
		}),
	);

command
	.command('get')
	.description('Get chat')
	.argument('<name>', 'chat name')
	.action(
		use(
			error,
			accountValidator,
			nameValidator,
		)(async (name) => {
			const data = (await chats.exists()) ? await chats.get() : {};
			if (!data[name]) throw new ActionError(`Chat doesn't exist`);

			console.log(data[name]);
		}),
	);

command
	.command('set')
	.description('Set chat')
	.argument('<name>', 'chat name')
	.argument('<id>', 'chat ID')
	.action(
		use(
			error,
			accountValidator,
			nameValidator,
			idValidator,
		)(async (name, id) => {
			const data = (await chats.exists()) ? await chats.get() : {};
			if (data[name]) throw new ActionError(`Chat already exists`);

			data[name] = id;
			await chats.set(data);

			console.log('Chat was set successfully');
		}),
	);

command
	.command('connect')
	.description('Connect to chat')
	.argument('<name>', 'chat name')
	.action(
		use(
			error,
			accountValidator,
			nameValidator,
		)(async (name) => {
			const data = (await chats.exists()) ? await chats.get() : {};
			if (!data[name]) throw new ActionError(`Chat doesn't exist`);

			socket.on(
				'connect_error',
				error((err) => {
					throw err;
				}),
			);

			socket.on(
				'disconnect',
				error((reason) => {
					throw new Error(`Disconnected unexpectedly: ${JSON.stringify(reason)}`);
				}),
			);

			socket.on('connect', () => {
				console.log('Connected');
			});

			socket.connect();
			console.log(`Connecting...`);
		}),
	);

export { command };
