ARG NODE_VERSION=20



####################
###  TEST BUILD  ###
####################

FROM node:${NODE_VERSION} as test

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

CMD [ "npm", "run", "dev" ]



####################
###  BASE BUILD  ###
####################

FROM node:${NODE_VERSION} as build

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build



####################
###  PROD BUILD  ###
####################

FROM node:${NODE_VERSION}-alpine as prod

ENV NODE_ENV production

USER root

RUN apk add --no-cache curl

RUN npm install pm2 -g

USER node

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./

COPY .env.example package.json ./

EXPOSE 3000

HEALTHCHECK CMD curl --fail http://localhost:3000/healthcheck || exit 1

CMD [ "pm2-runtime", "app.js" ]
