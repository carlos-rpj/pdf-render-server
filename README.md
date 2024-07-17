# PDF Renderer

This is a docker container that renders a PDF file using a puppeteer instance.  
<https://hub.docker.com/r/carlosrpj/puppeteer-server-render>

## Instalation

First, you will need the docker and docker compose installed.  
Execute the follow command to start the container:

```bash
docker compose up -d
```

## Render PDF files

This container can render a PDF file from a url (GET request) and body data (POST request).

### Render from URL

GET /render

#### Params:
- url: [string] The url to be consumed (required).
- filename: [string] The name of generated file without extension (required).
- headers: [object] Http headers to be consumed on the url (autorization, token, etc).
- options: [object] The puppeteer page options.
- download: [true, false] The response would open in new tab, or will download

### Render from body

POST /render

#### Headers:
- Content-Type: text/html

#### Params:
- filename: [string] The name of generated file without extension (required).
- options: [object] The puppeteer page options.
- download: [true, false] The response would open in new tab, or will download.

#### Body:
The html to be rendered.

### Health check

GET /check

> This is a health check endpoint, you can define it on your container configurations