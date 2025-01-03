FROM node:22.12.0-alpine3.20

WORKDIR /rtchat-ws

COPY turbo.json pnpm-workspace.yaml package.json .npmrc ./

COPY apps/ws ./apps/ws

COPY packages/db ./packages/db
COPY packages/common ./packages/common
COPY packages/typescript-config ./packages/typescript-config
COPY packages/eslint-config ./packages/eslint-config

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run prisma:generate

RUN pnpm run build

EXPOSE 5000

CMD [ "pnpm", "run", "start:ws" ]