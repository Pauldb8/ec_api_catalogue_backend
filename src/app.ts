import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs, { mkdirSync } from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { accessLogPath, nodeEnvironment, release, sentryDsn } from './config/environment';
import { JwtUser } from './middlewares/auth';
import { errorHandler, errorIsUnknownType, notFound } from './middlewares/error';
import apisRouter from './routes/apis';

const app = express();

// Sentry initialization with Express integration
Sentry.init({
	dsn: sentryDsn,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Sentry.Integrations.Express({ app }),
		new RewriteFrames({
			iteratee: frame => {
				const fileDir = __dirname;
				// const fileDir = path.dirname(new URL(import.meta.url).pathname);
				const workingDir = process.cwd();
				if (!frame.filename) return frame;
				if (frame.filename.startsWith(fileDir)) frame.filename = '/' + path.relative(fileDir, frame.filename).split(path.sep).join(path.posix.sep);
				if (frame.filename.startsWith(workingDir)) frame.filename = '/' + path.relative(workingDir, frame.filename).split(path.sep).join(path.posix.sep);
				return frame;
			},
		}),
	],
	...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
	tracesSampleRate: 1.0,
	release: release,
	environment: nodeEnvironment,
	enabled: !!nodeEnvironment,
});

app.use(Sentry.Handlers.requestHandler({ ip: true, user: Object.keys(JwtUser.shape) }));
app.use(Sentry.Handlers.tracingHandler());

// Morgan logger setup
if (nodeEnvironment) {
	mkdirSync(path.dirname(accessLogPath), { recursive: true });
	app.use(
		morgan('combined', {
			stream: fs.createWriteStream(accessLogPath, { flags: 'a' }),
		})
	);
} else {
	app.use(morgan('dev'));
}

// Middleware setup
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Routing setup
app.use('/apis', apisRouter);

// Error handling
app.use(notFound);
app.use(Sentry.Handlers.errorHandler({ shouldHandleError: errorIsUnknownType }));
app.use(errorHandler);

// Starting the Express server
app.listen(3000, '0.0.0.0', () => {
	console.log(`Listening at http://0.0.0.0:3000`);
	const startupTransaction = Sentry.startTransaction({
		op: 'startup',
		name: 'Microservice startup',
	});
	startupTransaction.finish();
});
