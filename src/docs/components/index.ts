import apiComponent from './api';

const allComponents = [
  apiComponent,
  // Add other components as you create them
];

// Format all component objects into a single OpenAPI-compatible 'components' object
const mergedComponents = {
  schemas: allComponents.reduce((acc, component) => {
    return { ...acc, ...component };
  }, {}),
};

export default mergedComponents;
