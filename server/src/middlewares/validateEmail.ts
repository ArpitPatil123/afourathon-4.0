import { Request, Response, NextFunction } from "express";
import createError from "../utils/createError";
import { User } from "../utils/types";

export const validateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email }: User = req.body;

  // Check if the email is valid
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regex.test(email)) {
    return createError(req, res, next, "Please provide a valid email", 400);
  }

  next();
};
