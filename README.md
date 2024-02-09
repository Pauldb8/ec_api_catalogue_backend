# European Commission - API Catalog Backend

This is an express server backend for European Commission - API Catalog.

## Setup

Install recommended extensions from `.vscode/extensions.json` in vscode.

```
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

Start debugging using `Launch Local` vscode launch configuration. Project will build automatically before starting.

### Inside Docker

Build and start the docker containers using `docker-compose up -d --build`.

Make sure the local build is up to date by running `npm run build`. This is important because local source maps are used by the debugger.

Then attach the debugger using `Attach Docker` vscode launch configuration.

Or just let vscode do all of the steps above for you by using `Launch Docker` vscode launch configuration.

### Dispose

Before closing the project, run `docker compose down` to dispose of any remaining docker containers.
