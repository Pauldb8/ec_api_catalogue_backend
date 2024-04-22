import { version } from '../utils/environment';
import { isProdEnv } from '../utils/isProdEnv';
import paths from './paths';
import components from './components';

const devServer = {
  url: 'http://localhost:3000/',
  description: 'Local Development Server',
};

const prodServer = {
  url: 'https://api.api-catalogue.tech.ec.europa.eu',
  description: 'Production Server',
};

const openapi = {
  openapi: '3.0.1',
  info: {
    version,
    title: 'API Catalogue Backend - Documentation',
    description: '',
    license: {
      name: 'EUPL v1.2',
      url: 'https://code.europa.eu/api-gateway/api-catalogue-backend/-/blob/master/LICENSE',
    },
  },
  servers: isProdEnv() ? [prodServer] : [devServer, prodServer],
  paths,
  components,
};

export { openapi };
