/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export function parseOptions(req, res, next) {
  try {
    if (typeof req.query.options === 'string') {
      req.query.options = JSON.parse(req.query.options);
    }

    if (typeof req.query.headers === 'string') {
      req.query.headers = JSON.parse(req.query.headers);
    }
  } catch (error) {
    const err = new Error('Error when parse to JSON the query options');
    err.statusCode = 400;
    return next(err);
  }

  next();
}
