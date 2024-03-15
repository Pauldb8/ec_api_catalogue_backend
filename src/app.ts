import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs, { mkdirSync } from 'fs';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import {
  accessLogPath,
  mongoURI,
  nodeEnvironment,
  release,
  sentryDsn,
} from './utils/environment';
import { JwtUser } from './middlewares/auth';
import {
  errorHandler,
  errorIsUnknownType,
  notFound,
} from './middlewares/error';
import apisRouter from './routes/apis';
import { openapi } from './docs/openapi';
import { absolutePath } from 'swagger-ui-dist';
import swaggerUi from 'swagger-ui-express';

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
  enabled: !!nodeEnvironment,
});

app.use(
  Sentry.Handlers.requestHandler({
    ip: true,
    user: Object.keys(JwtUser.shape),
  }),
);
app.use(Sentry.Handlers.tracingHandler());

// Morgan logger setup
if (nodeEnvironment) {
  mkdirSync(path.dirname(accessLogPath), { recursive: true });
  app.use(
    morgan('combined', {
      stream: fs.createWriteStream(accessLogPath, { flags: 'a' }),
    }),
  );
} else {
  app.use(morgan('dev'));
}

// Connect to the database
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connection established'))
  .catch(error => console.error('MongoDB connection error:', error));

// Middleware setup
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Routing setup
app.use('/apis', apisRouter);

// OpenAPI documentation setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
// Serve the Swagger UI assets
app.use(express.static(absolutePath()));

// Error handling
app.use(notFound);
app.use(
  Sentry.Handlers.errorHandler({ shouldHandleError: errorIsUnknownType }),
);
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
