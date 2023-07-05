import { Request, Response, NextFunction } from "express";
import { User, customError } from "../utils/types.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, id, phone, cnfPassword }: User = req.body;

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
  const user = await UserModel.findOne({ email: email });

  if (user) {
    const error: customError = {
      success: false,
      status: 409,
      message: "User already Exists",
    };
    return next(error);
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const newUser: User = new UserModel({
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: User = req.body;

  // Check if the user exists
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    const error: customError = {
      success: false,
      status: 404,
      message: "User not found",
    };
    return next(error);
  }

  // Check if the password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const error: customError = {
      success: false,
      status: 401,
      message: "Invalid password",
    };
    return next(error);
  }

  // Create and assign a token
  const token = jwt.sign(
    { _id: user._id, name: user.name, id: user.id },
    process.env.TOKEN_SECRET!
  );

  // Set token in cookie
  res.cookie("auth-token", token, {
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
  });
};
