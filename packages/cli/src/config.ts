import 'dotenv/config';

import process from 'node:process';

export const config = {
	getServerUrl: () => process.env['SERVER_URL'],
};
