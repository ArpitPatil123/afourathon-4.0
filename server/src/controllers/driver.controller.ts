import { Request, Response, NextFunction } from "express";
import { Driver } from "../utils/types.js";
import DriverModel from "../models/driver.model.js";
import createError from "../utils/createError.js";
import CabModel from "../models/cab.model.js";

// Add driver details into the database
export const addDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { driverId, driverName, driverEmail, driverPhone }: Driver = req.body;

  // Check if all the required fields are present and valid phone number
  if (!driverId || !driverName || !driverEmail || !driverPhone) {
    return createError(req, res, next, "Please provide all the details", 400);
  }

  if (driverPhone.length !== 10) {
    return createError(
      req,
      res,
      next,
      "Please provide a valid phone number",
      400
    );
  }
  // Check if the driver already exists if the driver exists, return an error Else, create a new driver
  const driver = await DriverModel.findOne({
    $or: [{ driverEmail: driverEmail }, { driverId: driverId }],
  });
  if (driver) {
    return createError(req, res, next, "Driver already exists", 409);
  }

  // Create a new driver
  const newDriver: Driver = new DriverModel({
    driverId,
    driverName,
    driverEmail,
    driverPhone,
  });

  // Save the driver in the database
  const savedDriver = await newDriver.save();

  // Send the response
  res.status(201).json({
    success: true,
    message: "Driver added successfully",
    data: savedDriver,
  });
};

// Get list of all the drivers
export const getAllDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get all the drivers
  const drivers = await DriverModel.find();

  // Check if the drivers array is empty
  if (drivers.length === 0) {
    return createError(req, res, next, "No drivers found", 404);
  }

  // Send the response
  res.status(200).json({
    success: true,
    message: "List of all the drivers",
    data: drivers,
  });
};

// Assign cab to the driver
export const assignCab = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { driverId, cabRegistrationNumber } = req.params;

  // Check if the driverId and cabRegistrationNumber is present
  if (!driverId || !cabRegistrationNumber) {
    return createError(
      req,
      res,
      next,
      "Please provide Driver Id and Cab Registration Number",
      400
    );
  }

  // Check if the driver exists
  const driver = await DriverModel.findOne({ driverId: driverId });
  if (!driver) {
    return createError(req, res, next, "Driver not found", 404);
  }

  // Check if the cab exists
  const cab = await CabModel.findOne({
    cabRegistrationNumber: cabRegistrationNumber,
  });
  if (!cab) {
    return createError(req, res, next, "Cab not found", 404);
  }

  // Check if the cab is already assigned to a driver
  if (cab.driverId) {
    return createError(
      req,
      res,
      next,
      "Cab is already assigned to Driver",
      409
    );
  }

  // Assign cab to the driver
  await DriverModel.updateOne(
    { driverId: driverId },
    { $set: { cabRegistrationNumber: cabRegistrationNumber } }
  );

  // Update the cab with the driverId
  await CabModel.updateOne(
    { cabRegistrationNumber: cabRegistrationNumber },
    { $set: { driverId: driverId } }
  );

  // Send the response
  res.status(200).json({
    success: true,
    message: "Cab assigned successfully",
  });
};

// Delete driver details from the database using driverId
export const deleteDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { driverId } = req.params;

  // Check if the driver exists
  const driver = await DriverModel.findOne({ driverId: driverId });
  if (!driver) {
    return createError(req, res, next, "Driver does not exist", 404);
  }

  // Delete the driverId assigned to the cab if any
  await CabModel.updateOne(
    { driverId: driverId },
    { $set: { driverId: null } }
  );

  // Delete the driver
  await DriverModel.deleteOne({ driverId: driverId });

  // Send the response
  res.status(200).json({
    success: true,
    message: "Driver deleted successfully",
  });
};
