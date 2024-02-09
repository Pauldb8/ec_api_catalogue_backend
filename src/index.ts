import { bindIp, bindPort, nodeEnvironment, release, sentryDsn, sslCertPath, sslKeyPath } from '@lib/config/environment.js';
import { RewriteFrames } from '@sentry/integrations';
import Sentry from '@sentry/node';
import fs from 'fs/promises';
import http from 'http';
import https from 'https';
import path from 'path';
import app from './app.js';

const workingDir = process.cwd();
const fileDir = path.dirname(new URL(import.meta.url).pathname);

Sentry.init({
	dsn: sentryDsn,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Sentry.Integrations.Express({ app }),
		new RewriteFrames({
			iteratee: frame => {
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

const server = await (async function () {
	try {
		return https.createServer({ key: await fs.readFile(sslKeyPath), cert: await fs.readFile(sslCertPath) }, app);
	} catch (err) {
		if (!nodeEnvironment && err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') return http.createServer(app);
		else throw err;
	}
})();

const startupTransaction = Sentry.startTransaction({
	op: 'startup',
	name: 'Microservice startup',
});

console.log('NodeEnvironment:', nodeEnvironment);
server.listen(bindPort, bindIp, undefined, () => console.log(`Listening at http${server instanceof https.Server ? 's' : ''}://${bindIp}:${bindPort}`));

startupTransaction.finish();
