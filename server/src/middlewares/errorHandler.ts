import { Request, Response, NextFunction } from "express";
import { customError } from "../utils/types.js";

// Global Error Handler Middleware
const errorHandler = (
  err: customError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status).json({
    success: err.success,
    message: err.message,
  });
};

export default errorHandler;
