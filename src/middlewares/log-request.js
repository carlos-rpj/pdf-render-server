export function logRequest(req, res, next) {
  console.log(`[${req.method}]`, req.path, JSON.stringify(req.query, null, 2));
  next();
}