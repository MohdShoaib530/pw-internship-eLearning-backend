import fs from 'fs';

const errorMiddleware = (error, req, res, __next) => {
  if (req.file?.path) {
    fs.unlinkSync(req.file.path);
  }

  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Error middleware issue';

  res.status(error.statusCode).json({
    status: 'error',
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack
  });
};

export default errorMiddleware;
