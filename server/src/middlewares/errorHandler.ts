import { Request, Response, NextFunction } from "express";
import { customError } from "../utils/types.js";

// Global Error Handler Middleware
const errorHandler = (
  err: customError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log to console for dev
  console.log(err);

  res.status(err.status).json({
    success: err.success,
    message: err.message,
  });
};

export default errorHandler;
