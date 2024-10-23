# Docker NodeJS best practice
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

FROM docker.io/node:lts-slim

ENV NODE_ENV=production
ENV PORT=4111
ENV HOST=0.0.0.0

USER node
WORKDIR /home/node

COPY --chown=node:node dist/apps/my-nest-app my-nest-app

RUN npm ci --prefix my-nest-app --omit=dev --no-audit --no-fund

CMD [ "node", "my-nest-app/main.js" ]
