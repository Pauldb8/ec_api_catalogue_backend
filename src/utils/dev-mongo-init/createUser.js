db.createUser({
    user: "webapp",
    pwd: "password",
    roles: [
        {
            role: "readWrite",
            db: "ec_api_catalogue_backend",
        },
    ],
});
