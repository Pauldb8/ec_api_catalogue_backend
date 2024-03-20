db.createUser({
  user: process.env.MONGO_INITDB_USER_NAME,
  pwd: process.env.MONGO_INITDB_USER_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: "ec_api_catalogue_backend",
    },
  ],
});

console.log(`DEBUG LOG : User ${process.env.MONGO_INITDB_USER_NAME} with password ${process.env.MONGO_INITDB_USER_PASSWORD} created successfully`);
