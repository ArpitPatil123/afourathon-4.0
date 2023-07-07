import CabModel from "../models/cab.model.js";
import createError from "../utils/createError.js";
import DriverModel from "../models/driver.model.js";
// Add cab details into the database
export const addCab = async (req, res, next) => {
    const { cabRegistrationNumber, cabModel, cabColour } = req.body;
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
export const getAllCabs = async (req, res, next) => {
    // Get all the cabs from the database
    const cabs = await CabModel.find({});
    // Check if cabs array is empty
    if (cabs.length === 0) {
        return createError(req, res, next, "No cabs found", 404);
    }
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cabs fetched successfully",
        data: cabs,
    });
};
// Assign driver to a cab
export const assignDriver = async (req, res, next) => {
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
    // Check if the cab is already assigned to a driver
    if (cab.driverId) {
        return createError(req, res, next, "Driver is already assigned to this Cab", 409);
    }
    // Assign the driver to the cab
    const assignedCab = await CabModel.findOneAndUpdate({ cabRegistrationNumber: cabRegistrationNumber }, { $set: { driverId: driverId } });
    // Update the driver details
    await DriverModel.findOneAndUpdate({ driverId: driverId }, { $set: { cabRegistrationNumber: cabRegistrationNumber } });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Driver assigned successfully",
        data: assignedCab,
    });
};
// Delete a cab from the database
export const deleteCab = async (req, res, next) => {
    const { cabRegistrationNumber } = req.params;
    // Check if the cab exists
    const cab = await CabModel.findOne({
        cabRegistrationNumber: cabRegistrationNumber,
    });
    // If the cab does not exist, return an error
    if (!cab) {
        return createError(req, res, next, "Cab does not exist", 404);
    }
    // Delete the cabRegistrationNumber from the driver
    await DriverModel.findOneAndUpdate({ cabRegistrationNumber: cabRegistrationNumber }, { $set: { cabRegistrationNumber: null } });
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
