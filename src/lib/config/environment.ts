import dotenv from 'dotenv';
import fs from 'fs/promises';

const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8')) as { name: string; version: string };
if (typeof packageJson !== 'object' || typeof packageJson.name !== 'string' || typeof packageJson.version !== 'string' || !packageJson.name || !packageJson.version) throw new Error('Invalid package.json');

const dotenvResult = dotenv.config();
if (dotenvResult.error) throw dotenvResult.error;

const exampleVars = dotenv.parse(await fs.readFile('.env.example'));
const missingVars = Object.keys(exampleVars).filter(key => !process.env[key]);

if (missingVars.length > 0) throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);

export const release = packageJson.name + '@' + packageJson.version;
export const nodeEnvironment = process.env.NODE_ENV;
export const bindIp = process.env.BIND_IP as string;
export const bindPort = Number(process.env.BIND_PORT);
export const accessLogPath = process.env.ACCESS_LOG_PATH as string;
export const sslKeyPath = process.env.SSL_KEY_PATH as string;
export const sslCertPath = process.env.SSL_CERT_PATH as string;
export const apisJSONPath = process.env.APIS_PATH as string;
export const authJwtSecret = process.env.AUTH_JWT_SECRET as string;
export const sentryDsn = process.env.SENTRY_DSN as string;
