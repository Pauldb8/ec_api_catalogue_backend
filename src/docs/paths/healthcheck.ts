const healthcheckPaths = {
  '/healthcheck': {
    get: {
      summary: 'Health Check',
      description:
        'Returns OK with the current UTC timestamp to indicate that the service is up and running.',
      responses: {
        '200': {
          description: 'Service is up and running',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'OK',
                  },
                  timestamp: {
                    type: 'string',
                    example: '2024-03-20T12:34:56.789Z',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default healthcheckPaths;
