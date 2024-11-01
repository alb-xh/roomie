import { logger } from '../logger';
import { ActionError } from './errors';

export type Middleware = (
	action: (...args: any[]) => Promise<void>,
) => (...args: any[]) => Promise<void>;

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
		}
	};

export const validator =
	(validate: (...args: any[]) => Promise<void>): Middleware =>
	(action) =>
	async (...args) => {
		await validate(...args);
		await action(...args);
	};
