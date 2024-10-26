import process from 'node:process';

export class Env {
	static isProduction(): boolean {
		return process.env['NODE_ENV'] === 'production';
	}

	static isDevelopment(): boolean {
		return !this.isProduction();
	}
}
