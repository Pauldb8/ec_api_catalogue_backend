const apisPaths = {
  '/apis': {
    get: {
      summary: 'Retrieve a list of APIs',
      description:
        'Returns a list of APIs from the catalogue. Supports filtering by search term, tenant, and featured status, with pagination.',
      parameters: [
        {
          name: 'search',
          in: 'query',
          description:
            "A search term to filter APIs based on 'name', 'context', 'provider', 'version', and 'description'.",
          required: false,
          schema: {
            type: 'string',
          },
        },
        {
          name: 'tenant',
          in: 'query',
          description:
            'Filter APIs by their tenant, identifying the owner or consumer of the API.',
          required: false,
          schema: {
            type: 'string',
          },
        },
        {
          name: 'featured',
          in: 'query',
          description:
            'Filter APIs by whether they are featured. Accepts "true" or "false".',
          required: false,
          schema: {
            type: 'boolean',
          },
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination (starts from 1).',
          required: false,
          schema: {
            type: 'integer',
            default: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page for pagination.',
          required: false,
          schema: {
            type: 'integer',
            default: 10,
          },
        },
      ],
      responses: {
        '200': {
          description: 'A paginated list of APIs',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  currentPage: {
                    type: 'integer',
                    example: 1,
                  },
                  totalPages: {
                    type: 'integer',
                    example: 5,
                  },
                  itemsPerPage: {
                    type: 'integer',
                    example: 10,
                  },
                  apis: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Api',
                    },
                  },
                },
              },
            },
          },
        },
        '500': {
          description: 'Internal Server Error',
        },
      },
    },
    post: {
      summary: 'Create a new API',
      description: 'Adds a new API to the catalog.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Api',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'API created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Api',
              },
            },
          },
        },
        '400': {
          description: 'Invalid input',
        },
        '500': {
          description: 'Internal Server Error',
        },
      },
    },
  },
  '/apis/{apiId}': {
    get: {
      summary: 'Retrieve a single API by ID',
      description:
        'Returns a single API object from the catalog based on the API ID.',
      parameters: [
        {
          name: 'apiId',
          in: 'path',
          required: true,
          description: 'The ID of the API to retrieve.',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        '200': {
          description: 'An API object',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Api',
              },
            },
          },
        },
        '404': {
          description: 'API not found',
        },
        '500': {
          description: 'Internal Server Error',
        },
      },
    },
    patch: {
      summary: 'Update parts of an existing API',
      description: 'Performs a partial update of an API identified by its ID.',
      parameters: [
        {
          name: 'apiId',
          in: 'path',
          required: true,
          description: 'The ID of the API to update.',
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                context: { type: 'string' },
                businessOwner: { type: 'string' },
                technicalOwner: { type: 'string' },
                version: { type: 'string' },
                provider: { type: 'string' },
                openapiDefinition: { type: 'object' },
                featured: { type: 'boolean' },
                tenant: { type: 'string' },
              },
              required: [],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'API updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Api',
              },
            },
          },
        },
        '400': {
          description: 'Invalid input',
        },
        '404': {
          description: 'API not found',
        },
        '500': {
          description: 'Internal Server Error',
        },
      },
    },
  },
};

export default apisPaths;
