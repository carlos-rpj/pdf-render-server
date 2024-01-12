import 'express-async-errors';
import express from 'express';

import { cors } from './middlewares/cors.js';
import { logRequest } from './middlewares/log-request.js';
import { healthCheck } from './middlewares/health-check.js';
import { parseOptions } from './middlewares/parse-options.js';
import { renderPdfFromUrl, renderPdfStream } from './middlewares/render-pdf.js';

const port = process.env.PORT || 3000;
const app = express();

app.use(cors);
app.use(parseOptions)
app.use(logRequest);

app.get('/check', healthCheck);
app.get('/render', renderPdfFromUrl);
app.post('/render', renderPdfStream);

app.use(function(req, res, next) {
  res.status(404).json({
    statusCode: 404,
    error: 'Not found'
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    statusCode: statusCode,
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
