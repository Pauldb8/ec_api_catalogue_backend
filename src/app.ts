import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs, { mkdirSync } from 'fs';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import { accessLogPath, mongoURI, nodeEnvironment } from './utils/environment';
import { errorHandler, notFound } from './middlewares/error';
import apisRouter from './routes/apis';
import { openapi } from './docs/openapi';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Morgan logger setup
switch (nodeEnvironment) {
  case 'production':
    mkdirSync(path.dirname(accessLogPath), { recursive: true });
    app.use(
      morgan('combined', {
        stream: fs.createWriteStream(accessLogPath, { flags: 'a' }),
      }),
    );
    break;

  case 'development':
    app.use(morgan('dev'));
    break;
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
app.use(cors({ credentials: true }));

// Routing setup
app.use('/apis', apisRouter);

// OpenAPI documentation setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
