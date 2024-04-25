db.createUser({
  user: process.env.MONGO_INITDB_USER_NAME,
  pwd: process.env.MONGO_INITDB_USER_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE,
    },
  ],
});

if (process.env.NODE_ENV === 'development') {
  testDb = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE + '_test');
  testDb.createUser({
    user: process.env.MONGO_INITDB_TEST_NAME,
    pwd: process.env.MONGO_INITDB_TEST_PASSWORD,
    roles: [
      {
        role: 'readWrite',
        db: process.env.MONGO_INITDB_DATABASE + '_test',
      },
    ],
  });
}
