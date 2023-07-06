import { Request, Response, NextFunction } from "express";
import { customError } from "./types.js";

const createError = (
  req: Request,
  res: Response,
  next: NextFunction,
  message: string,
  code: number
) => {
  const error: customError = {
    success: false,
    status: code,
    message: message,
  };
  next(error);
};

export default createError;
