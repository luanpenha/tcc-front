import Laboratory from '../models/Laboratory.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { recordLog } from '../utils/recordLog.js';

export const listLaboratories = async (req, res) => {
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const laboratories = await Laboratory.find(filter);
  return successResponse(res, 'Laboratórios carregados com sucesso', { laboratories });
};

export const getLaboratory = async (req, res) => {
  const laboratory = await Laboratory.findById(req.params.id);
  if (!laboratory) {
    return errorResponse(res, 404, 'Laboratório não encontrado');
  }
  return successResponse(res, 'Laboratório encontrado', { laboratory });
};

export const createLaboratory = async (req, res) => {
  const { name, location, description, capacity, resources, status } = req.body;
  if (!name) {
    return errorResponse(res, 400, 'Nome do laboratório é obrigatório');
  }

  const laboratory = await Laboratory.create({
    name: name.trim(),
    location: location?.trim() || '',
    description: description?.trim() || '',
    capacity: capacity ? Number(capacity) : 0,
    resources: Array.isArray(resources) ? resources : resources?.split(',').map((item) => item.trim()).filter(Boolean) || [],
    status: status || 'active',
  });

  await recordLog({ action: 'create_laboratory', userId: req.user._id, metadata: { laboratoryId: laboratory._id } });
  return successResponse(res, 'Laboratório criado com sucesso', { laboratory });
};

export const updateLaboratory = async (req, res) => {
  const laboratory = await Laboratory.findById(req.params.id);
  if (!laboratory) {
    return errorResponse(res, 404, 'Laboratório não encontrado');
  }

  const { name, location, description, capacity, resources, status } = req.body;
  if (name) laboratory.name = name.trim();
  if (location) laboratory.location = location.trim();
  if (description) laboratory.description = description.trim();
  if (capacity != null) laboratory.capacity = Number(capacity);
  if (resources) {
    laboratory.resources = Array.isArray(resources) ? resources : resources.split(',').map((item) => item.trim()).filter(Boolean);
  }
  if (status) laboratory.status = status;

  await laboratory.save();
  await recordLog({ action: 'update_laboratory', userId: req.user._id, metadata: { laboratoryId: laboratory._id } });
  return successResponse(res, 'Laboratório atualizado com sucesso', { laboratory });
};

export const deleteLaboratory = async (req, res) => {
  const laboratory = await Laboratory.findById(req.params.id);
  if (!laboratory) {
    return errorResponse(res, 404, 'Laboratório não encontrado');
  }

  await laboratory.deleteOne();
  await recordLog({ action: 'delete_laboratory', userId: req.user._id, metadata: { laboratoryId: laboratory._id } });
  return successResponse(res, 'Laboratório removido com sucesso');
};
