import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { recordLog } from '../utils/recordLog.js';

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  return successResponse(res, 'Usuários carregados com sucesso', { users });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return errorResponse(res, 404, 'Usuário não encontrado');
  }
  return successResponse(res, 'Usuário encontrado', { user });
};

export const updateProfile = async (req, res) => {
  const user = req.user;
  const { name, email, course, registration, password } = req.body;

  if (name) user.name = name.trim();
  if (email) user.email = email.toLowerCase().trim();
  if (course) user.course = course.trim();
  if (registration) user.registration = registration.trim();
  if (password) user.password = password;

  await user.save();
  await recordLog({ action: 'update_profile', userId: user._id, metadata: { email: user.email } });

  return successResponse(res, 'Perfil atualizado com sucesso', { user: await User.findById(user._id).select('-password') });
};

export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return errorResponse(res, 404, 'Usuário não encontrado');
  }

  const { name, email, course, registration, role, status, password } = req.body;
  if (name) user.name = name.trim();
  if (email) user.email = email.toLowerCase().trim();
  if (course) user.course = course.trim();
  if (registration) user.registration = registration.trim();
  if (role) user.role = role;
  if (status) user.status = status;
  if (password) user.password = password;

  await user.save();
  await recordLog({ action: 'update_user', userId: req.user._id, metadata: { targetUserId: user._id } });

  return successResponse(res, 'Usuário atualizado com sucesso', { user: await User.findById(user._id).select('-password') });
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return errorResponse(res, 404, 'Usuário não encontrado');
  }

  await user.deleteOne();
  await recordLog({ action: 'delete_user', userId: req.user._id, metadata: { targetUserId: user._id } });

  return successResponse(res, 'Usuário removido com sucesso');
};
