ARG NODE_VERSION=20



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

RUN npm install pm2 -g

USER node

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./

COPY .env.example package.json ./

EXPOSE 3000

CMD [ "pm2-runtime", "app.js" ]
