import PrintRequest from '../models/PrintRequest.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { recordLog } from '../utils/recordLog.js';

export const createPrintRequest = async (req, res) => {
  const { title, description, material, quantity } = req.body;

  if (!req.file) {
    return errorResponse(res, 400, 'Arquivo de impressão necessário');
  }
  if (!title || !material) {
    return errorResponse(res, 400, 'Título e material são obrigatórios');
  }

  const printRequest = await PrintRequest.create({
    user: req.user._id,
    title: title.trim(),
    description: description?.trim() || '',
    filePath: req.file.path,
    material: material.trim(),
    quantity: quantity ? Number(quantity) : 1,
  });

  await recordLog({ action: 'create_print_request', userId: req.user._id, metadata: { printRequestId: printRequest._id } });
  return successResponse(res, 'Solicitação de impressão criada com sucesso', { printRequest });
};

export const getPrintRequests = async (req, res) => {
  const filter = {};
  if (req.user.role !== 'admin') {
    filter.user = req.user._id;
  }
  const printRequests = await PrintRequest.find(filter).populate('user', 'name email role');
  return successResponse(res, 'Solicitações carregadas com sucesso', { printRequests });
};

export const getPrintRequestById = async (req, res) => {
  const printRequest = await PrintRequest.findById(req.params.id).populate('user', 'name email role');
  if (!printRequest) {
    return errorResponse(res, 404, 'Solicitação não encontrada');
  }
  if (req.user.role !== 'admin' && printRequest.user._id.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Acesso negado à solicitação');
  }
  return successResponse(res, 'Solicitação encontrada', { printRequest });
};

export const updatePrintRequest = async (req, res) => {
  const printRequest = await PrintRequest.findById(req.params.id);
  if (!printRequest) {
    return errorResponse(res, 404, 'Solicitação não encontrada');
  }

  if (req.user.role !== 'admin' && printRequest.user.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Acesso negado à solicitação');
  }

  const { title, description, material, quantity, status, observation } = req.body;
  if (title) printRequest.title = title.trim();
  if (description) printRequest.description = description.trim();
  if (material) printRequest.material = material.trim();
  if (quantity != null) printRequest.quantity = Number(quantity);
  if (status) {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Apenas administradores podem alterar o status');
    }
    printRequest.status = status;
  }
  if (observation != null) {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Apenas administradores podem adicionar observações');
    }
    printRequest.observation = observation.trim();
  }

  if (req.file) {
    printRequest.filePath = req.file.path;
  }

  await printRequest.save();
  await recordLog({ action: 'update_print_request', userId: req.user._id, metadata: { printRequestId: printRequest._id } });
  return successResponse(res, 'Solicitação atualizada com sucesso', { printRequest });
};

export const deletePrintRequest = async (req, res) => {
  const printRequest = await PrintRequest.findById(req.params.id);
  if (!printRequest) {
    return errorResponse(res, 404, 'Solicitação não encontrada');
  }
  if (req.user.role !== 'admin' && printRequest.user.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Acesso negado à solicitação');
  }

  await printRequest.deleteOne();
  await recordLog({ action: 'delete_print_request', userId: req.user._id, metadata: { printRequestId: printRequest._id } });
  return successResponse(res, 'Solicitação removida com sucesso');
};
