FROM node:16-alpine AS builder

RUN apk add curl
WORKDIR /data
COPY src/ ./src/
COPY *.json ./
RUN npm ci
RUN npm run build

FROM node:16-alpine AS server

WORKDIR /data
COPY --from=builder /data/dist ./
ENV NODE_ENV=production
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
CMD ["node", "main"]
