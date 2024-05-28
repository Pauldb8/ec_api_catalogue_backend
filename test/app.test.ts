import request from 'supertest';
import app from '../src/app';

describe('Application', () => {
  describe('GET /healthcheck', () => {
    it('should return OK with a timestamp', async () => {
      const response = await request(app).get('/healthcheck');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: 'OK',
        timestamp: expect.any(String),
      });
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date); // Ensure it's a valid date
    });
  });
});
