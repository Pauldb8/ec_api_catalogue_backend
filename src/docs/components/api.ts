const apiComponent = {
  Api: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the API.',
      },
      description: {
        type: 'string',
        description: 'A brief description of the API.',
      },
      context: {
        type: 'string',
        description: 'The context or environment of the API.',
      },
      businessOwner: {
        type: 'string',
        description: 'The business owner of the API.',
      },
      technicalOwner: {
        type: 'string',
        description: 'The technical owner of the API.',
      },
      version: {
        type: 'string',
        description: 'The version of the API.',
      },
      provider: {
        type: 'string',
        description: 'The provider of the API.',
      },
      openapiDefinition: {
        type: 'object',
        description: 'The OpenAPI definition for the API.',
      },
      featured: {
        type: 'boolean',
        description:
          'Indicates if the API is featured in the API Catalogue, which means displayed on the main page.',
        default: false,
      },
      environment: {
        type: 'string',
        description: 'The operational environment of the API.',
        enum: ['intra', 'extra', 'acceptance', 'capi'],
      },
    },
    required: [
      'name',
      'description',
      'context',
      'businessOwner',
      'technicalOwner',
      'version',
      'provider',
      'openapiDefinition',
      'environment',
    ],
  },
};

export default apiComponent;
