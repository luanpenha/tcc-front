import { errorResponse } from '../utils/response.js';

export const adminMiddleware = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return errorResponse(res, 403, 'Acesso negado: administrador necessário');
  }
  next();
};
