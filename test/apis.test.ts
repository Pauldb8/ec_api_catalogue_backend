import request from 'supertest';
import fs from 'fs';
import app from '../src/app';
import ApiModel from '../src/models/apiModel';
import mongoose from 'mongoose';

describe('API Routes', () => {
  beforeAll(async () => {
    const data = JSON.parse(fs.readFileSync('test/data/apis.json', 'utf8'));
    await ApiModel.insertMany(data);
  });

  afterAll(async () => {
    await ApiModel.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /apis', () => {
    it('should return all APIs without any filter and expect 4 APIs', async () => {
      const response = await request(app).get('/apis');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(4);
    });

    it('should filter APIs by search term', async () => {
      const searchTerm = 'forecasting';
      const response = await request(app).get(`/apis?search=${searchTerm}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(
        response.body.every(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (api: any) =>
            api.name.includes(searchTerm) ||
            api.context.includes(searchTerm) ||
            api.description.includes(searchTerm) ||
            api.version.includes(searchTerm) ||
            api.provider.includes(searchTerm),
        ),
      ).toBeTruthy();
    });

    it('should filter APIs by tenant', async () => {
      const tenant = 'FinanceDept';
      const response = await request(app).get(`/apis?tenant=${tenant}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(
        response.body.every((api: { tenant: string }) => api.tenant === tenant),
      ).toBeTruthy();
    });

    it('should filter APIs by featured status', async () => {
      const featured = 'true';
      const response = await request(app).get(`/apis?featured=${featured}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(
        response.body.every(
          (api: { featured: boolean }) => api.featured === true,
        ),
      ).toBeTruthy();
    });
  });

  describe('GET /apis/:apiId', () => {
    it('should return a single API by ID', async () => {
      const apiId = '60b67b30-49b8-4959-a884-38e181851759';
      const response = await request(app).get(`/apis/${apiId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', apiId);
    });

    it('should return 404 for a non-existent API ID', async () => {
      const response = await request(app).get(
        '/apis/371fc329-caa0-4868-b21b-e42f9c089784',
      );
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /apis', () => {
    const apiToCreate = JSON.parse(
      fs.readFileSync('test/data/api-to-create.json', 'utf8'),
    );

    it('should return 400 on validation error for missing required fields', async () => {
      const requiredFields = [
        'id',
        'name',
        'description',
        'context',
        'tenant',
        'businessOwner',
        'technicalOwner',
        'version',
        'provider',
        'openapiDefinition',
      ];

      for (const field of requiredFields) {
        const invalidApi = { ...apiToCreate };
        delete invalidApi[field]; // Remove a required field

        const response = await request(app).post('/apis').send(invalidApi);
        expect(response.statusCode).toBe(400);
      }
    });

    it('should create a new API', async () => {
      const response = await request(app).post('/apis').send(apiToCreate);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id', apiToCreate.id);
      expect(response.body).toHaveProperty('name', apiToCreate.name);
    });
  });

  describe('PATCH /apis/:apiId', () => {
    let apiIdToUpdate: string;
    const apiToCreate = JSON.parse(
      fs.readFileSync('test/data/api-to-create.json', 'utf8'),
    );

    beforeAll(async () => {
      const createdApiResponse = await request(app)
        .post('/apis')
        .send(apiToCreate);
      apiIdToUpdate = createdApiResponse.body.id;
    });

    it('should partially update an existing API', async () => {
      const partialUpdate = {
        description: 'Updated description',
        featured: false,
      };

      const response = await request(app)
        .patch(`/apis/${apiIdToUpdate}`)
        .send(partialUpdate);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'description',
        partialUpdate.description,
      );
      expect(response.body).toHaveProperty('featured', partialUpdate.featured);
      // Verify the response still contains properties that were not updated
      expect(response.body).toHaveProperty('name', apiToCreate.name);
    });

    it('should return 404 for a non-existent API ID on update', async () => {
      const nonExistentApiId = '371fc329-caa0-4868-b21b-e42f9c089784';
      const response = await request(app)
        .patch(`/apis/${nonExistentApiId}`)
        .send({ description: 'New description' });
      expect(response.statusCode).toBe(404);
    });

    it('should return 400 for invalid updates', async () => {
      const invalidUpdate = { featured: 'not-a-boolean' }; // Incorrect type for 'featured'
      const response = await request(app)
        .patch(`/apis/${apiIdToUpdate}`)
        .send(invalidUpdate);
      expect(response.statusCode).toBe(400);
    });
  });
});
