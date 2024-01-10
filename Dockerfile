FROM node:20.10.0-alpine as build-image

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

WORKDIR /app
COPY package.json /app
COPY . /app

RUN echo "node-linker=hoisted" >> .npmrc
RUN corepack enable
RUN pnpm install --prod --frozen-lockfile

FROM node:20.10.0-alpine

WORKDIR /app
COPY --from=build-image /app /app
# COPY --from=build-image /root/.cache/puppeteer /root/.cache/puppeteer

ENV PUPEETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
RUN apk add --no-cache linux-headers binutils-gold nss
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# RUN apk add --no-cache curl make gcc g++ python3 linux-headers binutils-gold gnupg libstdc++ nss
# RUN apk add --no-cache chromium
# RUN apk del --no-cache make gcc g++ python3 binutils-gold gnupg libstdc++

RUN rm -rf /usr/include \
  && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/*

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads /app \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

# USER pptruser

ENTRYPOINT [ "node" ]
CMD [ "src/index.js" ]