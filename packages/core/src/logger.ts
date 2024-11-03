import winston from 'winston';
import { Env } from './env';

export enum LogLevel {
	Error = 'error',
	Info = 'info',
	Debug = 'debug',
}
export enum LogTransport {
	Console = 'console',
	File = 'file',
}
export type LoggerOptions = { level?: LogLevel; transport?: LogTransport };

export class Logger {
	private readonly baseLogger: winston.Logger;

	private transportMap: Record<LogTransport, winston.transport> = {
		[LogTransport.Console]: new winston.transports.Console({
			format: winston.format.simple(),
		}),
		[LogTransport.File]: new winston.transports.File({
			filename: 'combined.log',
		}),
	};

	constructor(options: LoggerOptions = {}) {
		this.baseLogger = winston.createLogger({
			level: (options.level ?? Env.isProduction()) ? LogLevel.Info : LogLevel.Debug,
			transports: [this.transportMap[options.transport ?? LogTransport.Console]],
		});
	}

	log(level: LogLevel, message: any) {
		this.baseLogger.log(level, JSON.stringify(message?.toString() ?? message));
	}

	debug(message: any) {
		this.log(LogLevel.Debug, message);
	}

	info(message: any) {
		this.log(LogLevel.Info, message);
	}

	error(message: any) {
		this.log(LogLevel.Error, message);
	}
}
