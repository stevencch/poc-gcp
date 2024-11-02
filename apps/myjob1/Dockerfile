# Docker NodeJS best practice
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

FROM docker.io/node:lts-alpine3.19

ENV NODE_ENV production

WORKDIR /home/node

COPY dist/apps/myjob1 myjob1

RUN npm ci --prefix myjob1 --omit=dev -f

USER node

CMD [ "node", "myjob1/main.js" ]