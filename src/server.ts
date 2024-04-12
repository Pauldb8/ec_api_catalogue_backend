import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import { nodeEnvironment, release, sentryDsn } from './utils/environment';
import { JwtUser } from './middlewares/auth';
import { errorIsUnknownType } from './middlewares/error';
import app from './app';
import path from 'path';
import { isProdEnv } from './utils/isProdEnv';

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
        if (frame.filename.startsWith(fileDir))
          frame.filename =
            '/' +
            path
              .relative(fileDir, frame.filename)
              .split(path.sep)
              .join(path.posix.sep);
        if (frame.filename.startsWith(workingDir))
          frame.filename =
            '/' +
            path
              .relative(workingDir, frame.filename)
              .split(path.sep)
              .join(path.posix.sep);
        return frame;
      },
    }),
  ],
  ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  tracesSampleRate: 1.0,
  release: release,
  environment: nodeEnvironment,
  enabled: isProdEnv(),
});

app.use(
  Sentry.Handlers.requestHandler({
    ip: true,
    user: Object.keys(JwtUser.shape),
  }),
);
app.use(Sentry.Handlers.tracingHandler());

// Error handling
app.use(
  Sentry.Handlers.errorHandler({ shouldHandleError: errorIsUnknownType }),
);

// Starting the Express server
app.listen(3000, '0.0.0.0', () => {
  console.log(`Listening at http://0.0.0.0:3000`);
  const startupTransaction = Sentry.startTransaction({
    op: 'startup',
    name: 'Microservice startup',
  });
  startupTransaction.finish();
});
