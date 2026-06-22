const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor';
  return res.status(status).json({ success: false, message });
};

export default errorHandler;
