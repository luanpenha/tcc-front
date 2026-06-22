import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { errorResponse } from '../utils/response.js';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Token de autenticação não fornecido');
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 401, 'Usuário não encontrado');
    }
    req.user = user;
    return next();
  } catch (error) {
    return errorResponse(res, 401, 'Token inválido ou expirado');
  }
};
