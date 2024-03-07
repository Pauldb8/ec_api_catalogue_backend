const fs = require("fs");

const data = JSON.parse(
  fs.readFileSync("/docker-entrypoint-initdb.d/apis-seeding.json", "utf8"),
);

db.apis.insertMany(data);
