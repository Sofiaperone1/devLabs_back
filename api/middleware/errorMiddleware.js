export function notFoundHandler(req, res, next) {
    const error = new Error(`La ruta ${req.originalUrl} no existe`);
    res.status(404);
    next(error);
  }
  
  export function globalErrorHandler(err, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
  