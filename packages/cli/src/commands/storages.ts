import path from 'node:path';

import { Storage } from '@roomie/core';

export type Account = { name: string };
export type Chats = Record<string, string>;

export const extension = `.storage.json`;
export const account = new Storage<Account>(path.resolve(import.meta.dirname, `account${extension}`));
export const chats = new Storage<Chats>(path.resolve(import.meta.dirname, `chats${extension}`));
