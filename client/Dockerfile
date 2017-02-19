FROM node:7.2.0

EXPOSE 3000
ENV PORT=3000

RUN mkdir build

RUN npm install -g yarn

WORKDIR /opt/app
COPY package.json yarn.lock ./

RUN yarn install

COPY src ./src/
COPY test ./test/
COPY .babelrc .eslintrc app.js webpack.config.js webpack.config.server.js webpack.config.shared.js ./

RUN yarn test
RUN yarn prod-build
RUN yarn prod-build-server
RUN rm -rf node_modules
RUN yarn install --production

CMD ["yarn", "prod-run"]
