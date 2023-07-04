import { Request, Response, NextFunction } from "express";
import { Driver, customError } from "../utils/types.js";
import DriverModel from "../models/driver.model.js";
import bcrypt from "bcryptjs";

export const registerDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, id, phone, cnfPassword }: Driver = req.body;

  // Check if the password and confirm password are same
  if (password !== cnfPassword) {
    const error: customError = {
      success: false,
      status: 401,
      message: "Password and confirm password doesn't match",
    };
    return next(error);
  }

  // Check if the user already exists if the user exists, return an error Else, create a new user
  const user = await DriverModel.findOne({ email: email });

  if (user) {
    const error: customError = {
      success: false,
      status: 409,
      message: "User already Exists",
    };
    return next(error);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser: Driver = new DriverModel({
    name,
    email,
    password: hashPassword,
    id,
    phone,
  });

  const savedUser = await newUser.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: savedUser,
  });
};
