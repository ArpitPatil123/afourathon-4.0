import { Request, Response, NextFunction } from "express";
import CabModel from "../models/cab.model.js";
import { Cab } from "../utils/types.js";
import createError from "../utils/createError.js";
import DriverModel from "../models/driver.model.js";

// Add cab details into the database
export const addCab = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cabRegistrationNumber, cabModel, cabColour }: Cab = req.body;

  // Check if all the required fields are present
  if (!cabRegistrationNumber || !cabModel || !cabColour) {
    return createError(req, res, next, "Please provide all the details", 400);
  }

  // Check if the cab already exists if the cab exists, return an error Else, create a new cab
  const cab = await CabModel.findOne({
    cabRegistrationNumber: cabRegistrationNumber,
  });

  // If the cab already exists, return an error
  if (cab) {
    return createError(req, res, next, "Cab already exists", 409);
  }

  // Create a new cab
  const newCab = new CabModel({
    cabRegistrationNumber,
    cabModel,
    cabColour,
  });

  // Save the cab details into the database
  const savedCab = await newCab.save();

  // Send the response
  res.status(201).json({
    success: true,
    message: "Cab details added successfully",
    data: savedCab,
  });
};

// Get all the cabs from the database
export const getAllCabs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get all the cabs from the database
  const cabs = await CabModel.find({});

  // Send the response
  res.status(200).json({
    success: true,
    message: "Cabs fetched successfully",
    data: cabs,
  });
};

// Assign driver to a cab
export const assignDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cabRegistrationNumber, driverId } = req.params;

  // Check if all the required fields are present
  if (!cabRegistrationNumber || !driverId) {
    return createError(req, res, next, "Please provide all the details", 400);
  }

  // Check if the cab exists
  const cab = await CabModel.findOne({
    cabRegistrationNumber: cabRegistrationNumber,
  });

  // If the cab does not exist, return an error
  if (!cab) {
    return createError(req, res, next, "Cab does not exist", 404);
  }

  // Check if the driver exists
  const driver = await DriverModel.findOne({ driverId: driverId });

  // If the driver does not exist, return an error
  if (!driver) {
    return createError(req, res, next, "Driver does not exist", 404);
  }

  // Assign the driver to the cab
  const assignedCab = await CabModel.findOneAndUpdate(
    { cabRegistrationNumber: cabRegistrationNumber },
    { $set: { driverId: driverId } }
  );

  // Send the response
  res.status(200).json({
    success: true,
    message: "Driver assigned successfully",
    data: assignedCab,
  });
};

// Delete a cab from the database
export const deleteCab = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cabRegistrationNumber } = req.params;

  // Check if all the required fields are present
  if (!cabRegistrationNumber) {
    return createError(
      req,
      res,
      next,
      "Please provide cab registration number",
      400
    );
  }

  // Check if the cab exists
  const cab = await CabModel.findOne({
    cabRegistrationNumber: cabRegistrationNumber,
  });

  // If the cab does not exist, return an error
  if (!cab) {
    return createError(req, res, next, "Cab does not exist", 404);
  }

  // Delete the cab from the database
  await CabModel.findOneAndDelete({
    cabRegistrationNumber: cabRegistrationNumber,
  });

  // Send the response
  res.status(200).json({
    success: true,
    message: "Cab deleted successfully",
  });
};
