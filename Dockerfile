FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json .
RUN npm clean-install

COPY . .
RUN npm run build
RUN npx sentry-cli sourcemaps inject dist

ENV NODE_ENV=production
ENV BIND_IP=0.0.0.0
ENV BIND_PORT=8080

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
