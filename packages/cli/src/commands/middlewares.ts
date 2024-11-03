import { isAlphanumeric, isLength, isUUID } from 'validator';

import { logger } from '../logger';
import { ActionError } from './errors';
import { account } from './storages';
import { exit } from 'node:process';

export type Middleware = (action: (...args: any[]) => Promise<void>) => (...args: any[]) => Promise<void>;

export const use =
	(...middlewares: Middleware[]): Middleware =>
	(action) =>
	async (...args) => {
		const enhancedAction = middlewares.reduceRight((cb, middleware) => middleware(cb), action);
		await enhancedAction(...args);
	};

export const error: Middleware =
	(action) =>
	async (...args) => {
		try {
			await action(...args);
		} catch (err) {
			if (err instanceof ActionError) {
				console.error(err.message);
				return;
			}

			logger.error(err);
			console.log('Something went wrong :(');

			exit();
		}
	};

export const validator =
	(validate: (...args: any[]) => Promise<void>): Middleware =>
	(action) =>
	async (...args) => {
		await validate(...args);
		await action(...args);
	};

export const accountValidator = validator(async () => {
	if (!(await account.exists())) throw new ActionError('Please set account name first');
});

export const nameValidator = validator(async (name: string) => {
	if (!isAlphanumeric(name)) throw new ActionError('Name must contain only letters and numbers');
	if (!isLength(name, { min: 4, max: 20 })) throw new ActionError('Name must be between 4 and 20 character long');
});

export const idValidator = validator(async (_, id: string) => {
	if (!isUUID(id)) throw new ActionError('Id must be a UUID');
});
