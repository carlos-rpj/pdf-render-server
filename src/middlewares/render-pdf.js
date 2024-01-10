import { renderFromData, renderFromUrl } from "../lib/puppeteer-render.js";

export async function renderPdf(req, res) {
  if (req.query.url) {
    return await renderFromUrl(req, res);
  } else if (req.query.data) {
    return await renderFromData(req, res);
  }

  res.status(400);
  res.json({
    error: 'Invalid option'
  })
}