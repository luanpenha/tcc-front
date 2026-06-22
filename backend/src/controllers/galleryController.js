import GalleryItem from '../models/GalleryItem.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { recordLog } from '../utils/recordLog.js';

export const listGallery = async (req, res) => {
  const gallery = await GalleryItem.find().sort({ createdAt: -1 });
  return successResponse(res, 'Galeria carregada com sucesso', { gallery });
};

export const getGalleryItem = async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) {
    return errorResponse(res, 404, 'Item da galeria não encontrado');
  }
  return successResponse(res, 'Item encontrado', { item });
};

export const createGalleryItem = async (req, res) => {
  const { title, description, author } = req.body;
  if (!title) {
    return errorResponse(res, 400, 'Título é obrigatório');
  }

  const imagePaths = req.files?.map((file) => file.path) || [];
  const item = await GalleryItem.create({
    title: title.trim(),
    description: description?.trim() || '',
    author: author?.trim() || req.user.name,
    images: imagePaths,
  });

  await recordLog({ action: 'create_gallery_item', userId: req.user._id, metadata: { galleryItemId: item._id } });
  return successResponse(res, 'Projeto adicionado à galeria com sucesso', { item });
};

export const updateGalleryItem = async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) {
    return errorResponse(res, 404, 'Item da galeria não encontrado');
  }

  const { title, description, author } = req.body;
  if (title) item.title = title.trim();
  if (description) item.description = description.trim();
  if (author) item.author = author.trim();
  if (req.files?.length) {
    item.images = req.files.map((file) => file.path);
  }

  await item.save();
  await recordLog({ action: 'update_gallery_item', userId: req.user._id, metadata: { galleryItemId: item._id } });
  return successResponse(res, 'Projeto atualizado com sucesso', { item });
};

export const deleteGalleryItem = async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) {
    return errorResponse(res, 404, 'Item da galeria não encontrado');
  }

  await item.deleteOne();
  await recordLog({ action: 'delete_gallery_item', userId: req.user._id, metadata: { galleryItemId: item._id } });
  return successResponse(res, 'Projeto removido da galeria com sucesso');
};
