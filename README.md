# European Commission - API Catalog Backend

This is an express server backend for European Commission - API Catalog.

## Setup

Install recommended extensions from `.vscode/extensions.json` in vscode.

```sh
npm install
```

## Lint, Format, Build

Run `npm run lint` to lint the project using ESLint.

Run `npm run format` to format the project using Prettier.

Run `npm run build` to build the project using Typescript. The build artifacts will be stored in the `dist` directory.

VSCode automatically formats and lints on save. Git automatically lints and formats on commit.

## Run & Debug

### Locally

Open or create the `.env` file and set the variables according to examples from `.env.example`.
Note that for local develoment, all config related env variables have already been filled in the docker compose setup.
Start the docker containers using `docker-compose up -d `.

### Dispose

Before closing the project, run `docker compose down` to dispose of any remaining docker containers.

## Build the prod Docker image

```sh
docker build --target prod -t ec-api-catalogue-backend:latest .
```
