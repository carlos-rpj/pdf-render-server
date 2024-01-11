import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  executablePath: process.env.PUPEETEER_EXECUTABLE_PATH || undefined,
  headless: 'new',
  args: ['--no-sandbox'],
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    console.log(`Closing browser on ${signal}`)
    await browser.close();
    process.exit(0);
  });
}

export async function renderFromData(req, res) {
  const page = await browser.newPage();
  await page.setContent(req.query.data, { waitUntil: 'domcontentloaded' });
  sendFile(page, req, res);
}

export async function renderFromUrl(req, res) {
  const page = await browser.newPage();
  await page.goto(req.query.url, { waitUntil: 'domcontentloaded' });
  sendFile(page, req, res);
}

/**
 * @typedef {{ filename: string, download: boolean, options: import('puppeteer').PDFOptions }} Options
 * @param {import('puppeteer').Page} page 
 * @param {{ query: Options }} req 
 * @param {*} res 
 */
async function sendFile(page, req, res) {
  const { options, filename, download } = req.query;
  const stream = await page.createPDFStream(JSON.parse(options));

  res.on('close', async () => {
    await page.close();
  });

  const headers = {
    'Content-Type': 'application/pdf',
  };

  if (download && download !== 'false') {
    headers['Content-Disposition'] = `attachment; filename="${filename || 'download'}.pdf"`;
  }

  res.status(200)
  res.header(headers);
  stream.pipe(res);
}