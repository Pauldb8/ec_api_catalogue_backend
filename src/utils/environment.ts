import dotenv from 'dotenv';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  name: string;
  version: string;
};
if (
  typeof packageJson !== 'object' ||
  typeof packageJson.name !== 'string' ||
  typeof packageJson.version !== 'string' ||
  !packageJson.name ||
  !packageJson.version
)
  throw new Error('Invalid package.json');

const exampleVars = dotenv.parse(readFileSync('.env.example'));
const missingVars = Object.keys(exampleVars).filter(key => !process.env[key]);

if (missingVars.length > 0)
  throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);

export const release = packageJson.name + '@' + packageJson.version;
export const version = packageJson.version;
export const nodeEnvironment = process.env.NODE_ENV;
export const accessLogPath = process.env.ACCESS_LOG_PATH ?? '';
export const authJwtSecret = process.env.AUTH_JWT_SECRET;

// Use differents Mongo Databases for test and other env
export const mongoURI =
  (nodeEnvironment !== 'test'
    ? process.env.MONGODB_URI
    : process.env.MONGODB_TEST_URI) ?? '';
