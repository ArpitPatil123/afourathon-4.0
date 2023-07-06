const createError = (req, res, next, message, code) => {
    const error = {
        success: false,
        status: code,
        message: message,
    };
    next(error);
};
export default createError;
