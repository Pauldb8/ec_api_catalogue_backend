import mongoose from 'mongoose';
import { mongoURI } from '../../src/utils/environment';

beforeAll(async () => {
  // Clean the test database
  await mongoose.connect(mongoURI);

  // Wait for the connection to be established
  await new Promise<void>(resolve => {
    if (mongoose.connection.readyState === 1) {
      // 1 = connected
      resolve();
    } else {
      mongoose.connection.on('connected', () => resolve());
    }
  });

  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.drop();
  }

  // Mock console to avoid log polutions in test
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'debug').mockImplementation(() => {});
});

afterAll(async () => {
  jest.restoreAllMocks();
  await mongoose.connection.close();
});
