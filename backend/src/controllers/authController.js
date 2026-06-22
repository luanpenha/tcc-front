import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { recordLog } from '../utils/recordLog.js';

dotenv.config();

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

export const register = async (req, res) => {
  const { name, email, registration, course, password } = req.body;
  if (!name || !email || !registration || !course || !password) {
    return errorResponse(res, 400, 'Todos os campos são obrigatórios');
  }

  const existsEmail = await User.findOne({ email: email.toLowerCase().trim() });
  if (existsEmail) {
    return errorResponse(res, 400, 'E-mail já cadastrado');
  }

  const existsRegistration = await User.findOne({ registration: registration.trim() });
  if (existsRegistration) {
    return errorResponse(res, 400, 'Matrícula já cadastrada');
  }

  const newUser = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    registration: registration.trim(),
    course: course.trim(),
    password,
    role: 'user',
  });

  const token = createToken(newUser);
  await recordLog({ action: 'register', userId: newUser._id, metadata: { email: newUser.email } });

  return successResponse(res, 'Cadastro realizado com sucesso', {
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      registration: newUser.registration,
      course: newUser.course,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return errorResponse(res, 400, 'E-mail e senha são obrigatórios');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.comparePassword(password))) {
    return errorResponse(res, 401, 'E-mail ou senha inválidos');
  }

  if (user.status === 'inactive') {
    return errorResponse(res, 403, 'Usuário inativo. Contate o administrador.');
  }

  const token = createToken(user);
  await recordLog({ action: 'login', userId: user._id, metadata: { email: user.email } });

  return successResponse(res, 'Login realizado com sucesso', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      registration: user.registration,
      course: user.course,
      role: user.role,
      status: user.status,
    },
  });
};

export const profile = async (req, res) => {
  const user = req.user;
  return successResponse(res, 'Perfil carregado com sucesso', { user });
};
