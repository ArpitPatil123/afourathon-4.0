import DriverModel from "../models/driver.model.js";
import createError from "../utils/createError.js";
import CabModel from "../models/cab.model.js";
// Add driver details into the database
export const addDriver = async (req, res, next) => {
    const { driverId, driverName, driverEmail, driverPhone } = req.body;
    // Check if all the required fields are present and valid phone number
    if (!driverId || !driverName || !driverEmail || !driverPhone) {
        return createError(req, res, next, "Please provide all the details", 400);
    }
    if (driverPhone.length !== 10) {
        return createError(req, res, next, "Please provide a valid phone number", 400);
    }
    // Check if the driver already exists if the driver exists, return an error Else, create a new driver
    const driver = await DriverModel.findOne({
        $or: [{ driverEmail: driverEmail }, { driverId: driverId }],
    });
    if (driver) {
        return createError(req, res, next, "Driver already exists", 409);
    }
    // Create a new driver
    const newDriver = new DriverModel({
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
// Delete driver details from the database using driverId
export const deleteDriver = async (req, res, next) => {
    const { driverId } = req.params;
    // Check if the driverId is present
    if (!driverId) {
        return createError(req, res, next, "Please provide the driverId", 400);
    }
    // Check if the driver exists
    const driver = await DriverModel.findOne({ driverId: driverId });
    if (!driver) {
        return createError(req, res, next, "Driver does not exist", 404);
    }
    // Delete the driver
    await DriverModel.deleteOne({ driverId: driverId });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Driver deleted successfully",
    });
};
// Get list of all the drivers
export const getAllDrivers = async (req, res, next) => {
    // Get all the drivers
    const drivers = await DriverModel.find();
    // Send the response
    res.status(200).json({
        success: true,
        message: "List of all the drivers",
        data: drivers,
    });
};
// Assign cab to the driver
export const assignCab = async (req, res, next) => {
    const { driverId, cabId } = req.params;
    // Check if the driverId and cabId is present
    if (!driverId || !cabId) {
        return createError(req, res, next, "Please provide all the details", 400);
    }
    // Check if the driver exists
    const driver = await DriverModel.findOne({ driverId: driverId });
    if (!driver) {
        return createError(req, res, next, "Driver not found", 404);
    }
    // Check if the cab exists
    const cab = await CabModel.findOne({ cabId: cabId });
    if (!cab) {
        return createError(req, res, next, "Cab not found", 404);
    }
    // Assign cab to the driver
    await DriverModel.updateOne({ driverId: driverId }, { $set: { cabId: cabId } });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cab assigned successfully",
    });
};
