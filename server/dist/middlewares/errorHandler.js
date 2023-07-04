// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    console.log(err);
    res.status(err.status).json({
        success: err.success,
        message: err.message,
    });
};
export default errorHandler;
