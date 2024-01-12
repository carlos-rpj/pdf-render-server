import { createPDFRenderer } from "../lib/puppeteer-render.js";

export async function renderPdfFromUrl(req, res, next) {
  const { url, filename, download, headers, options } = req.query;

  if (!url) {
    const error = new Error('url is required');
    error.statusCode = 400;
    return next(error);
  }

  const renderer = createPDFRenderer();
  const result = await renderer.fromUrl(url, headers, options);
  
  if (download == 'true') {
    return await result.download(res, filename);
  }

  return await result.send(res);
}

export async function renderPdfStream(req, res) {
  const { options, download, filename } = req.query;

  const renderer = createPDFRenderer();
  const result = await renderer.fromStream(req, options);

  if (download == 'true') {
    return await result.download(res, filename);
  }

  return await result.send(res);
}
