const apisPaths = {
  '/apis': {
    get: {
      summary: 'Retrieve a list of APIs',
      description:
        'Returns a list of APIs from the catalog. Can accept a search parameter to filter the results based on searchable fields.',
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
      ],
      responses: {
        '200': {
          description: 'A JSON array of APIs',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Api',
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
  },
};

export default apisPaths;
