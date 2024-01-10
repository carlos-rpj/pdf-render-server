import puppeteer from 'puppeteer';

export async function getPuppeteer() {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPEETEER_EXECUTABLE_PATH || undefined,
    headless: 'new',
    args: ['--no-sandbox'],
  });

  return await browser.newPage();
}

export async function renderFromData(req, res) {
  const page = await getPuppeteer();
  await page.setContent(req.query.data, { waitUntil: 'domcontentloaded' });
  sendFile(page, req, res);
}

export async function renderFromUrl(req, res) {
  const page = await getPuppeteer();
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

  stream.on('close', async () => {
    await page.browser().close();
  });

  const headers = {
    'Content-Type': 'application/pdf',
  };

  if (download && download !== 'false') {
    headers['Content-Disposition'] = `attachment; filename="${filename || 'download'}.pdf"`;
  }

  res.status(200)
  res.header(headers);
  stream.pipe(res, { end: true });
}