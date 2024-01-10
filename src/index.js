import 'express-async-errors';
import express from 'express';

import { cors } from './middlewares/cors.js';
import { logRequest } from './middlewares/log-request.js';
import { healthCheck } from './middlewares/health-check.js';
import { renderPdf } from './middlewares/render-pdf.js';

const port = process.env.PORT || 3000;
const app = express();

app.use(cors);
app.use(logRequest);

app.get('/check', healthCheck);
app.get('/render', renderPdf);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
