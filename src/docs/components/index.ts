import apiComponent from './api';
import apiSummaryComponent from './apiSummary';

const allComponents = [
  apiComponent,
  apiSummaryComponent,
  // Add other components as you create them
];

// Format all component objects into a single OpenAPI-compatible 'components' object
const mergedComponents = {
  schemas: allComponents.reduce((acc, component) => {
    return { ...acc, ...component };
  }, {}),
};

export default mergedComponents;
