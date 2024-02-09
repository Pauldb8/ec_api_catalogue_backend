import { accessLogPath, nodeEnvironment } from '@lib/config/environment.js';
import { JwtUser } from '@lib/middleware/auth.js';
import { errorHandler, errorIsUnknownType, notFound } from '@lib/middleware/error.js';
import Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apisRouter from './routers/apis.js';

const app = express();

app.use(Sentry.Handlers.requestHandler({ ip: true, user: Object.keys(JwtUser.shape) }));
app.use(Sentry.Handlers.tracingHandler());

if (nodeEnvironment) {
	await fs.promises.mkdir(path.dirname(accessLogPath), { recursive: true });
	app.use(
		morgan('combined', {
			stream: fs.createWriteStream(accessLogPath, { flags: 'a' }),
		})
	);
} else app.use(morgan('dev'));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use('/apis', apisRouter);

app.use(notFound);
app.use(Sentry.Handlers.errorHandler({ shouldHandleError: errorIsUnknownType }));
app.use(errorHandler);

export default app;
