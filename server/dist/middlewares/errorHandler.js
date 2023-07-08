// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    res.status(err.status).json({
        success: err.success,
        message: err.message,
    });
};
export default errorHandler;
