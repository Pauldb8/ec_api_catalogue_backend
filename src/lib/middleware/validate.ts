import { RequestHandler } from 'express';
import { UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

interface RequestValidators<TParams, TQuery, TBody> {
	params?: ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, TParams, TParams>;
	query?: ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, TQuery, TQuery>;
	body?: ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, TBody, TBody>;
}

export default function validate<TParams = never, TQuery = never, TBody = never>(validators: RequestValidators<TParams, TQuery, TBody>): RequestHandler<TParams, never, TBody, TQuery> {
	return async function (req, _, next) {
		try {
			if (validators.params) req.params = await validators.params.parseAsync(req.params);
			if (validators.query) req.query = await validators.query.parseAsync(req.query);
			if (validators.body) req.body = await validators.body.parseAsync(req.body);
			next();
		} catch (err) {
			next(err);
		}
	};
}
