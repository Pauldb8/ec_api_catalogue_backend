FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json .
RUN npm clean-install

COPY . .
RUN npm run build
RUN npx sentry-cli sourcemaps inject dist


USER root
RUN npm install pm2 -g
RUN npm install cross-env -g

USER node

ENV NODE_ENV=production
ENV BIND_IP=0.0.0.0
ENV BIND_PORT=8080

EXPOSE 8080
CMD ["cross-env", "NODE_ENV=production", "pm2-runtime", "dist/index.js"]
#CMD [ "node", "dist/index.js" ]
