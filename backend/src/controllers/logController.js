import Log from '../models/Log.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const listLogs = async (req, res) => {
  const logs = await Log.find().sort({ createdAt: -1 }).limit(200).populate('user', 'name email');
  return successResponse(res, 'Logs carregados com sucesso', { logs });
};

export const getLogById = async (req, res) => {
  const log = await Log.findById(req.params.id).populate('user', 'name email');
  if (!log) {
    return errorResponse(res, 404, 'Log não encontrado');
  }
  return successResponse(res, 'Log encontrado', { log });
};
