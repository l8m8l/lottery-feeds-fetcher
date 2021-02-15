FROM node:15.8.0-alpine AS build-stage
RUN apk update && apk add curl && rm -rf /var/cache/apk/*
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
WORKDIR /build
COPY src ./src
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile
RUN node-prune

FROM node:15.8.0-alpine
WORKDIR /app
COPY --from=build-stage /build/src ./src
COPY --from=build-stage /build/node_modules ./node_modules
COPY --from=build-stage /build/package.json ./
ENTRYPOINT ["yarn", "start"]
