import Material from '../models/Material.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { recordLog } from '../utils/recordLog.js';

export const listMaterials = async (req, res) => {
  const materials = await Material.find();
  return successResponse(res, 'Materiais carregados com sucesso', { materials });
};

export const getMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return errorResponse(res, 404, 'Material não encontrado');
  }
  return successResponse(res, 'Material encontrado', { material });
};

export const createMaterial = async (req, res) => {
  const { name, quantity, unit, minimumQuantity } = req.body;
  if (!name || !unit) {
    return errorResponse(res, 400, 'Nome e unidade são obrigatórios');
  }

  const material = await Material.create({
    name: name.trim(),
    quantity: quantity != null ? Number(quantity) : 0,
    unit: unit.trim(),
    minimumQuantity: minimumQuantity != null ? Number(minimumQuantity) : 0,
  });

  await recordLog({ action: 'create_material', userId: req.user._id, metadata: { materialId: material._id } });
  return successResponse(res, 'Material cadastrado com sucesso', { material });
};

export const updateMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return errorResponse(res, 404, 'Material não encontrado');
  }

  const { name, quantity, unit, minimumQuantity } = req.body;
  if (name) material.name = name.trim();
  if (quantity != null) material.quantity = Number(quantity);
  if (unit) material.unit = unit.trim();
  if (minimumQuantity != null) material.minimumQuantity = Number(minimumQuantity);

  await material.save();
  await recordLog({ action: 'update_material', userId: req.user._id, metadata: { materialId: material._id } });
  return successResponse(res, 'Material atualizado com sucesso', { material });
};

export const deleteMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return errorResponse(res, 404, 'Material não encontrado');
  }

  await material.deleteOne();
  await recordLog({ action: 'delete_material', userId: req.user._id, metadata: { materialId: material._id } });
  return successResponse(res, 'Material removido com sucesso');
};
