import express from 'express';

import { healthCheck } from '../middlewares/health-check.js';
import { renderPdfFromUrl, renderPdfStream } from '../middlewares/render-pdf.js';

const router = express.Router();

router.get('/check', healthCheck);
router.get('/render', renderPdfFromUrl);
router.post('/render', renderPdfStream);

export { router as apiRouter };