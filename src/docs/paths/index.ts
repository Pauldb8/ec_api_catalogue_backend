import healthcheckPaths from './healthcheck';
import apisPaths from './apis';

const allPaths = [
  healthcheckPaths,
  apisPaths,
  // Add other paths as you create them
];

// Merge all route objects into a single paths object
const mergedPaths = allPaths.reduce((acc, route) => {
  return { ...acc, ...route };
}, {});

export default mergedPaths;
