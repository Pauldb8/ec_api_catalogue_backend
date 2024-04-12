const apiSummaryComponent = {
  ApiSummary: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'b390257b-3e2e-4e9a-808b-dfcb3a09acab' },
      name: { type: 'string', example: 'Example API' },
      description: { type: 'string', example: 'This is an example API' },
      context: { type: 'string', example: '/example' },
      businessOwner: { type: 'string', example: 'John Doe' },
      technicalOwner: { type: 'string', example: 'Jane Doe' },
      version: { type: 'string', example: '1.0' },
      provider: { type: 'string', example: 'ExampleProvider' },
      featured: { type: 'boolean', example: false },
      tenant: { type: 'string', example: 'DefaultTenant' },
    },
    required: [
      'id',
      'name',
      'description',
      'context',
      'businessOwner',
      'technicalOwner',
      'version',
      'provider',
      'featured',
      'tenant',
    ],
  },
};

export default apiSummaryComponent;
