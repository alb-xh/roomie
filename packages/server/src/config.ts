import process from 'node:process';
import path from 'path';
import dotEnv from 'dotenv';

dotEnv.config({ path: path.resolve(import.meta.dirname, '../.env') });

export const config = {
	getPort: () => Number(process.env['PORT']),
};
