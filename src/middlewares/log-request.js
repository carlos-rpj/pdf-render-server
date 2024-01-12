/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export function logRequest(req, res, next) {
  console.log(`${new Date().toISOString()} | [${req.method}]`, req.path, req.query);
  next();
}
