import 'dotenv/config';

import process from 'node:process';

export const config = {
	getPort: () => Number(process.env['PORT']),
};
