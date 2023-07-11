var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import crypto from "crypto";
import DriverModel from "../models/driver.model.js";
import createError from "../utils/createError.js";
import CabModel from "../models/cab.model.js";
// Add driver details into the database
export const addDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverName, driverEmail, driverPhone } = req.body;
    if (!driverName || !driverEmail || !driverPhone) {
        return createError(req, res, next, "Please provide all the details", 400);
    }
    // Check phone number
    if (driverPhone.length !== 10) {
        return createError(req, res, next, "Please provide a valid phone number", 400);
    }
    // Check if the driver already exists
    const driver = yield DriverModel.findOne({
        $or: [{ driverEmail }, { driverPhone }],
    });
    // If the driver already exists, return an error
    if ((driver === null || driver === void 0 ? void 0 : driver.driverEmail) == driverEmail) {
        return createError(req, res, next, "Email already exists", 409);
    }
    // Check if phone number already exists
    if ((driver === null || driver === void 0 ? void 0 : driver.driverPhone) === driverPhone) {
        return createError(req, res, next, "Phone number already exists", 409);
    }
    // Genereate a driver id
    const driverId = crypto.randomUUID();
    // Create a new driver
    const newDriver = new DriverModel({
        driverId,
        driverName,
        driverEmail,
        driverPhone,
    });
    // Save the driver in the database
    yield newDriver.save();
    // Send the response
    res.status(201).json({
        success: true,
        message: "Driver added successfully",
        data: newDriver,
    });
});
// Get all the drivers from the database
export const getAllDrivers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all the drivers from the database
    const drivers = yield DriverModel.find();
    // Check if found or not
    if (drivers.length === 0) {
        return createError(req, res, next, "No drivers found", 404);
    }
    // Send the response
    res.status(200).json({
        success: true,
        message: "Drivers fetched successfully",
        data: drivers,
    });
});
// Delete driver details from the database
export const deleteDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = req.params;
    // Check if the driver exists
    const driver = yield DriverModel.findOne({ driverId });
    // If not exists, return an error
    if (!driver) {
        return createError(req, res, next, "Driver not found", 404);
    }
    // Check if driver is assigned to the cab
    if (driver.cabRegistrationNumber !== null) {
        // Set it to null
        yield DriverModel.updateOne({
            driverId,
        }, {
            $set: {
                cabRegistrationNumber: null,
            },
        });
    }
    // Delete the driver from the database
    yield DriverModel.deleteOne({ driverId });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Driver deleted successfully",
    });
});
// Assign cab to the driver
export const assignCab = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId, cabRegistrationNumber } = req.params;
    // Check if the driver exists
    const driver = yield DriverModel.findOne({ driverId });
    // Return an error if not exists
    if (!driver) {
        return createError(req, res, next, "Driver not found", 404);
    }
    // Check if the cab exists
    const cab = yield CabModel.findOne({ cabRegistrationNumber });
    // Return an error if not exists
    if (!cab) {
        return createError(req, res, next, "Cab not found", 404);
    }
    // Check if the cab is already assigned
    if (cab.isAssigned) {
        return createError(req, res, next, "Cab is already assigned to another driver", 409);
    }
    // Assign the cab to the driver
    yield DriverModel.updateOne({ driverId }, { $set: { cabRegistrationNumber } });
    // Update the cab status
    yield CabModel.updateOne({ cabRegistrationNumber }, { $set: { isAssigned: true } });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cab assigned successfully",
    });
});
// Unassign cab from the driver
export const unassignCab = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = req.params;
    // Check if the driver exists
    const driver = yield DriverModel.findOne({ driverId });
    // Return an error if not exists
    if (!driver) {
        return createError(req, res, next, "Driver not found", 404);
    }
    // Check if the cab is assigned
    if (!driver.cabRegistrationNumber) {
        return createError(req, res, next, "Cab already not assigned to this driver", 404);
    }
    // Update the cab status
    yield CabModel.updateOne({ cabRegistrationNumber: driver.cabRegistrationNumber }, { $set: { isAssigned: false } });
    // Unassign the cab from the driver
    yield DriverModel.updateOne({ driverId }, { $set: { cabRegistrationNumber: null } });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cab unassigned successfully",
    });
});
// Get all drivers with cab assigned
export const getAllDriversWithCab = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all the drivers with cab assigned
    const drivers = yield DriverModel.find({
        cabRegistrationNumber: { $ne: null },
    });
    // Check if found or not
    if (drivers.length === 0) {
        return createError(req, res, next, "No drivers found", 404);
    }
    // Send the response
    res.status(200).json({
        success: true,
        message: "Drivers fetched successfully",
        data: drivers,
    });
});
// Get all drivers without cab assigned
export const getAllDriversWithoutCab = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all the drivers without cab assigned
    const drivers = yield DriverModel.find({
        cabRegistrationNumber: null,
    });
    // Check if found or not
    if (drivers.length === 0) {
        return createError(req, res, next, "No drivers found", 404);
    }
    // Send the response
    res.status(200).json({
        success: true,
        message: "Drivers fetched successfully",
        data: drivers,
    });
});
// Update driver details in the database
export const updateDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = req.params;
    const { driverName, driverEmail, driverPhone } = req.body;
    // Check if the driver exists
    const driver = yield DriverModel.findOne({ driverId });
    // If not exists, return an error
    if (!driver) {
        return createError(req, res, next, "Driver not found", 404);
    }
    // Update the driver details
    yield DriverModel.updateOne({ driverId }, {
        $set: {
            driverName,
            driverEmail,
            driverPhone,
        },
    });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Driver details updated successfully",
    });
});
