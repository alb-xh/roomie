import path from 'node:path';
import { Command } from 'commander';
import { Storage } from '@roomie/core';

import { logger } from '../logger';

const nameRegex = /^[A-Za-z0-9_]{4,20}$/;

type AccountData = { name: string };

const storage = new Storage<AccountData>(
	path.resolve(__dirname, './account-storage.json'),
);

const command = new Command('account')
	.description('Manage user account')
	.action(async () => {
		try {
			const exists = await storage.exists();
			if (!exists) {
				console.log('Please set the account first!');
				return;
			}

			const { name } = await storage.get();
			console.log(`Name: ${name}`);
		} catch (err) {
			logger.error(err);
			console.log('Smth went wrong');
		}
	});

command
	.command('set')
	.description('Set the name of the user')
	.argument('<name>', 'user name')
	.action(async (name) => {
		if (!nameRegex.test(name)) {
			console.log('Invalid name');
			return;
		}

		try {
			await storage.set({ name });

			console.log(`Name: ${name}`);
		} catch (err) {
			logger.error(err);
			console.log('Smth went wrong');
		}
	});

export { command };
