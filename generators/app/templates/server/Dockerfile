FROM node:7

WORKDIR /app
COPY package.json /app
RUN yarn install

ENV PORT 80
EXPOSE 80

CMD ["yarn", "start:server"]
