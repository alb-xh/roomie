import { Logger, LogTransport } from '@roomie/core';

export const logger = new Logger({ transport: LogTransport.File });
