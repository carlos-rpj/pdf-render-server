export function cors(req, res, next) {
  if (req.method !== 'OPTIONS') return next();

  res.status(200)
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });

  return res.end();
}