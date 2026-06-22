import Booking from '../models/Booking.js';
import Laboratory from '../models/Laboratory.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { recordLog } from '../utils/recordLog.js';

const isOverlap = (existing, startTime, endTime) => {
  return !(endTime <= existing.startTime || startTime >= existing.endTime);
};

export const createBooking = async (req, res) => {
  const { laboratory: laboratoryId, date, startTime, endTime } = req.body;
  if (!laboratoryId || !date || !startTime || !endTime) {
    return errorResponse(res, 400, 'Todos os campos do agendamento são obrigatórios');
  }

  const now = new Date();
  const bookingDate = new Date(`${date}T00:00:00`);
  if (bookingDate < new Date(now.toDateString())) {
    return errorResponse(res, 400, 'Não é possível agendar para datas passadas');
  }

  if (startTime >= endTime) {
    return errorResponse(res, 400, 'Horário de início deve ser anterior ao horário de término');
  }

  const laboratory = await Laboratory.findById(laboratoryId);
  if (!laboratory) {
    return errorResponse(res, 404, 'Laboratório não encontrado');
  }
  if (laboratory.status !== 'active') {
    return errorResponse(res, 400, 'Não é possível agendar em laboratórios inativos ou em manutenção');
  }

  const conflicts = await Booking.find({
    laboratory: laboratoryId,
    date,
    status: { $ne: 'cancelled' },
  });

  const hasOverlap = conflicts.some((booking) => isOverlap(booking, startTime, endTime));
  if (hasOverlap) {
    return errorResponse(res, 400, 'Já existe um agendamento para este horário');
  }

  const booking = await Booking.create({
    user: req.user._id,
    laboratory: laboratoryId,
    date,
    startTime,
    endTime,
  });

  await recordLog({ action: 'create_booking', userId: req.user._id, metadata: { bookingId: booking._id } });
  return successResponse(res, 'Agendamento criado com sucesso', { booking });
};

export const getBookings = async (req, res) => {
  const filter = {};
  if (req.user.role !== 'admin') {
    filter.user = req.user._id;
  }

  const bookings = await Booking.find(filter).populate('laboratory').populate('user', 'name email role');
  return successResponse(res, 'Agendamentos carregados com sucesso', { bookings });
};

export const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('laboratory').populate('user', 'name email role');
  if (!booking) {
    return errorResponse(res, 404, 'Agendamento não encontrado');
  }
  if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Acesso negado ao agendamento');
  }
  return successResponse(res, 'Agendamento encontrado', { booking });
};

export const updateBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return errorResponse(res, 404, 'Agendamento não encontrado');
  }

  const isOwner = booking.user.toString() === req.user._id.toString();
  const { laboratory: laboratoryId, date, startTime, endTime, status } = req.body;

  if (req.user.role !== 'admin' && !isOwner) {
    return errorResponse(res, 403, 'Acesso negado ao agendamento');
  }

  if (req.user.role !== 'admin' && status && status !== 'cancelled') {
    return errorResponse(res, 403, 'Apenas administradores podem alterar o status para este agendamento');
  }

  if (date) booking.date = date;
  if (startTime) booking.startTime = startTime;
  if (endTime) booking.endTime = endTime;
  if (laboratoryId) booking.laboratory = laboratoryId;
  if (status) booking.status = status;

  if (booking.startTime >= booking.endTime) {
    return errorResponse(res, 400, 'Horário de início deve ser anterior ao horário de término');
  }

  const laboratory = await Laboratory.findById(booking.laboratory);
  if (!laboratory) {
    return errorResponse(res, 404, 'Laboratório não encontrado');
  }

  const conflicts = await Booking.find({
    _id: { $ne: booking._id },
    laboratory: booking.laboratory,
    date: booking.date,
    status: { $ne: 'cancelled' },
  });

  const hasOverlap = conflicts.some((existing) => isOverlap(existing, booking.startTime, booking.endTime));
  if (hasOverlap) {
    return errorResponse(res, 400, 'Já existe um agendamento para este horário');
  }

  await booking.save();
  await recordLog({ action: 'update_booking', userId: req.user._id, metadata: { bookingId: booking._id } });
  return successResponse(res, 'Agendamento atualizado com sucesso', { booking });
};

export const deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return errorResponse(res, 404, 'Agendamento não encontrado');
  }
  if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Acesso negado ao agendamento');
  }

  await booking.deleteOne();
  await recordLog({ action: 'delete_booking', userId: req.user._id, metadata: { bookingId: booking._id } });
  return successResponse(res, 'Agendamento removido com sucesso');
};
