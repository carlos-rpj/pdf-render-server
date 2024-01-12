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

class PDFRendererResult {
  /**
   * @param {import('puppeteer').Page} page 
   * @param {import('puppeteer').PDFOptions} options 
   */
  constructor(page, options) {
    this.page = page;
    this.options = typeof options === 'string' ? JSON.parse(options) : options;
  }

  /**
   * @param {import('express').Response} res 
   */
  async send(res) {
    const pdfStream = await this.page.createPDFStream(this.options);

    res.on('close', async () => {
      await this.page.close();
    });

    res.status(200).header({
      'Content-Type': 'application/pdf',
    });

    return pdfStream.pipe(res);
  }

  /**
   * @param {import('express').Response} res 
   * @param {string} filename 
   */
  async download(res, filename = 'download') {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    return await this.send(res);
  }
}

export class PDFRenderer {
  /**
   * @param {import('puppeteer').Browser} browser 
   */
  constructor(browser) {
    this.browser = browser;
  }

  /**
   * @param {string} data 
   * @param {import('puppeteer').PDFOptions} options 
   * @returns {Promise<PDFRendererResult>}
   */
  async fromData(data, options) {
    const page = await browser.newPage();
    await page.setContent(data, { waitUntil: 'networkidle0' });
    return new PDFRendererResult(page, options);
  }

  /**
   * @param {string} url 
   * @param {Record<string, string>} headers
   * @param {import('puppeteer').PDFOptions} options 
   * @returns {Promise<PDFRendererResult>}
   */
  async fromUrl(url, headers, options) {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders(headers);
    await page.goto(url, { waitUntil: 'networkidle0' });
    return new PDFRendererResult(page, options);
  }

  /**
   * @param {import('node:stream').Readable} stream 
   * @param {import('puppeteer').PDFOptions} options 
   * @returns {Promise<PDFRendererResult>}
   */
  async fromStream(stream, options) {
    let html = '';
    for await (const chunk of stream) {
      html += chunk;
    }

    return await this.fromData(html, options);
  }
}

export function createPDFRenderer() {
  return new PDFRenderer(browser);
}
