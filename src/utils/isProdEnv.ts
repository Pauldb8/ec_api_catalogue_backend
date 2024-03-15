/**
 * Determines if the application is running in a production environment.
 * @returns {boolean} `true` if `NODE_ENV` is `production`, otherwise `false`.
 * @example
 * if (isProdEnv()) {
 *   console.log('Running in production mode');
 * } else {
 *   console.log('Running in development mode');
 * }
 */
export function isProdEnv(): boolean {
  return process.env.NODE_ENV === 'production';
}
