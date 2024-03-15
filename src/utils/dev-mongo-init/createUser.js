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
