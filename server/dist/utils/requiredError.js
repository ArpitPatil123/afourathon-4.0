const requiredError = (req, res, next, message, code) => {
    const error = {
        success: false,
        status: code,
        message: message,
    };
    return next(error);
};
export default requiredError;
