# Docker NodeJS best practice
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

FROM docker.io/node:lts-slim

ENV NODE_ENV=production
ENV PORT=4113
ENV HOST=0.0.0.0

USER node
WORKDIR /home/node

COPY --chown=node:node dist/apps/error-handler error-handler

RUN npm ci --prefix error-handler --omit=dev --no-audit --no-fund

CMD [ "node", "error-handler/main.js" ]
