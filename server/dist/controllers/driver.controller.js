import DriverModel from "../models/driver.model.js";
export const addDriver = async (req, res, next) => {
    const { driverId, driverName, driverEmail, driverPhone } = req.body;
    // Check if all the required fields are present and valid phone number
    if (!driverId || !driverName || !driverEmail || !driverPhone) {
        const error = {
            success: false,
            status: 400,
            message: "Please provide all the required fields",
        };
        return next(error);
    }
    if (driverPhone.length !== 10) {
        const error = {
            success: false,
            status: 400,
            message: "Please provide a valid phone number",
        };
        return next(error);
    }
    // Check if the driver already exists if the driver exists, return an error Else, create a new driver
    const driver = await DriverModel.findOne({ driverEmail: driverEmail });
    if (driver) {
        const error = {
            success: false,
            status: 409,
            message: "Driver already Exists",
        };
        return next(error);
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
        const error = {
            success: false,
            status: 400,
            message: "Please provide the driverId",
        };
        return next(error);
    }
    // Check if the driver exists
    const driver = await DriverModel.findOne({ driverId: driverId });
    if (!driver) {
        const error = {
            success: false,
            status: 404,
            message: "Driver not found",
        };
        return next(error);
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
        const error = {
            success: false,
            status: 400,
            message: "Please provide the driverId and cabId",
        };
        return next(error);
    }
    // Check if the driver exists
    const driver = await DriverModel.findOne({ driverId: driverId });
    if (!driver) {
        const error = {
            success: false,
            status: 404,
            message: "Driver not found",
        };
        return next(error);
    }
    // Check if the cab exists
    const cab = await DriverModel.findOne({ cabId: cabId });
    if (!cab) {
        const error = {
            success: false,
            status: 404,
            message: "Cab not found",
        };
        return next(error);
    }
    // Assign cab to the driver
    await DriverModel.updateOne({ driverId: driverId }, { $set: { cabId: cabId } });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cab assigned successfully",
    });
};
