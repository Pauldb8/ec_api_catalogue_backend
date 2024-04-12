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

console.log(`DEBUG LOG : User ${process.env.MONGO_INITDB_USER_NAME} with password ${process.env.MONGO_INITDB_USER_PASSWORD} created successfully`);
