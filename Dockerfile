FROM node:20-alpine AS chrome-image

ENV PUPEETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  curl

RUN rm -rf /usr/include \
  && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/*

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads /app \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

USER pptruser

FROM node:20-alpine AS build-image

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc /app/
COPY src/ /app/src/

RUN corepack enable
RUN pnpm install --prod --frozen-lockfile

FROM chrome-image

USER pptruser
WORKDIR /app
COPY --from=build-image --chown=pptruser:pptruser /app /app

ENTRYPOINT [ "node" ]
CMD [ "src/index.js" ]