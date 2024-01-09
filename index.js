import url from 'node:url';
import http from 'node:http';
import querystring from 'node:querystring';

import puppeteer from 'puppeteer';

const port = process.env.PORT || 3000;

async function getPuppeteer() {
  return await puppeteer.launch({
    headless: 'new'
  });
}

async function renderFromData(req, res, { data, options = {} }) {
  const browser = await getPuppeteer();
  const page = await browser.newPage();
  
  await page.setContent(data, { waitUntil: 'domcontentloaded' });
  const stream = await page.createPDFStream(options);

  stream.on('close', async () => {
    await browser.close();
  });

  sendFile(stream, res);
}

async function renderFromUrl(req, res, { url, options = {} }) {
  const browser = await getPuppeteer();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const stream = await page.createPDFStream(options);

  stream.on('close', async () => {
    await browser.close();
  });

  sendFile(stream, res);
}

async function sendFile(stream, res) {
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
  });

  stream.pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    return res.end();
  }

  const parsed = url.parse(req.url);
  const query = querystring.parse(parsed.query);

  if (query.url) {
    return await renderFromUrl(req, res, query);
  } else if (query.data) {
    return await renderFromData(req, res, query);
  }

  res.end('Invalid option');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
