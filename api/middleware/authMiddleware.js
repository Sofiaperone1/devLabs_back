export function ensureAuthenticated(req, res, next) {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).send('Acceso no autorizado');
    }
    next(); // Si está autenticado, pasa al siguiente middleware o controlador
  }

  