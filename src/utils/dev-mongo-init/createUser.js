db.createUser({
  user: process.env.MONGO_INITDB_USER_NAME,
  pwd: process.env.MONGO_INITDB_USER_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'ec_api_catalogue_backend',
    },
  ],
});

if (process.env.NODE_ENV === 'development') {
  testDb = db.getSiblingDB('ec_api_catalogue_backend_test');
  testDb.createUser({
    user: process.env.MONGO_INITDB_TEST_NAME,
    pwd: process.env.MONGO_INITDB_TEST_PASSWORD,
    roles: [
      {
        role: 'readWrite',
        db: 'ec_api_catalogue_backend_test',
      },
    ],
  });
}
