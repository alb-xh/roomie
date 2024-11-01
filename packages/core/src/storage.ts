import fs from 'node:fs/promises';

export class Storage<T> {
	constructor(private readonly path: string) {}

	async exists(): Promise<boolean> {
		try {
			await fs.access(this.path);
			return true;
		} catch {
			return false;
		}
	}

	async get(): Promise<T> {
		const content = await fs.readFile(this.path, { encoding: 'utf-8' });
		return JSON.parse(content);
	}

	async set(data: T): Promise<void> {
		await fs.writeFile(this.path, JSON.stringify(data));
	}
}
