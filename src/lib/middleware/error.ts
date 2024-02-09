import { nodeEnvironment } from '@lib/config/environment.js';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

export class ClientError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number = 400) {
		if (statusCode < 400 || statusCode >= 500) throw new Error('ClientError must have a status code between 400 and 499');
		super(message);
		this.statusCode = statusCode;
	}
}

export const notFound: RequestHandler = (req, res, next) => next(new ClientError(`🔍 - Not Found`, 404));

export function errorIsUnknownType(err: Error): boolean {
	if (err instanceof SyntaxError) return false;
	else if (err instanceof ZodError) return false;
	else if (err instanceof ClientError) return false;
	else return true;
}

export const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
	if (err instanceof SyntaxError) res.status(400).json({ message: '🤔 - Invalid JSON' });
	else if (err instanceof ZodError) res.status(422).json({ errors: err.errors });
	else if (err instanceof ClientError) res.status(err.statusCode).json({ message: err.message });
	else res.status(res.statusCode >= 400 ? res.statusCode : 500).json({ message: err.message, stack: nodeEnvironment ? '💶' : err.stack });
	next();
};
