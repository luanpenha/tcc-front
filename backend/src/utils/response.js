export const successResponse = (res, message, data = {}) => {
  return res.json({ success: true, message, data });
};

export const errorResponse = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};
