import User from '../models/User.js';
import Laboratory from '../models/Laboratory.js';
import Booking from '../models/Booking.js';
import PrintRequest from '../models/PrintRequest.js';
import Material from '../models/Material.js';
import { successResponse } from '../utils/response.js';

export const getDashboardInfo = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalLaboratories = await Laboratory.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const bookingsToday = await Booking.countDocuments({ date: new Date().toISOString().slice(0, 10) });
  const pendingPrints = await PrintRequest.countDocuments({ status: 'pending' });
  const printingPrints = await PrintRequest.countDocuments({ status: 'printing' });
  const finishedPrints = await PrintRequest.countDocuments({ status: 'finished' });
  const materialsCount = await Material.countDocuments();

  return successResponse(res, 'Dashboard carregado com sucesso', {
    totalUsers,
    totalLaboratories,
    totalBookings,
    bookingsToday,
    pendingPrints,
    printingPrints,
    finishedPrints,
    materialsCount,
  });
};
