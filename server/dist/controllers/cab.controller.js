var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CabModel from "../models/cab.model.js";
import createError from "../utils/createError.js";
import DriverModel from "../models/driver.model.js";
// Add cab details into the database
export const addCab = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cabRegistrationNumber, cabModel, cabColour } = req.body;
    // Check if all the required fields are present
    if (!cabRegistrationNumber || !cabModel || !cabColour) {
        return createError(req, res, next, "Please provide all the details", 400);
    }
    // Check cab registration number using regex
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
    // check if the cab registration number is valid
    if (!regex.test(cabRegistrationNumber)) {
        return createError(req, res, next, "Please provide a valid cab registration number", 400);
    }
    // Check if the cab already exists if the cab exists, return an error Else, create a new cab
    const cab = yield CabModel.findOne({
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
    const savedCab = yield newCab.save();
    // Send the response
    res.status(201).json({
        success: true,
        message: "Cab details added successfully",
        data: savedCab,
    });
});
// Get all the cabs from the database
export const getAllCabs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all the cabs from the database
    const cabs = yield CabModel.find();
    // check if the cabs array is empty
    if (cabs.length === 0) {
        return createError(req, res, next, "No cabs found", 404);
    }
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cabs fetched successfully",
        data: cabs,
    });
});
// Assign driver to the cab
export const assignDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId, cabRegistrationNumber } = req.params;
    // Check if driver exists
    const driver = yield DriverModel.findOne({ driverId });
    // If the driver does not exist, return an error
    if (!driver) {
        return createError(req, res, next, "Driver does not exist", 404);
    }
    // Check if the cab exists
    const cab = yield CabModel.findOne({ cabRegistrationNumber });
    // If the cab does not exist, return an error
    if (!cab) {
        return createError(req, res, next, "Cab does not exist", 404);
    }
    // Check if the cab is already assigned to a driver
    if (cab.isAssigned) {
        return createError(req, res, next, "Driver is already assigned", 409);
    }
    // Update the cab status
    yield CabModel.updateOne({
        cabRegistrationNumber,
    }, {
        $set: {
            isAssigned: true,
        },
    });
    // Update the Driver
    yield DriverModel.updateOne({ driverId }, {
        $set: {
            cabRegistrationNumber,
        },
    });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Driver assigned successfully",
    });
});
// Unassign driver from the cab
export const unassignDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cabRegistrationNumber } = req.params;
    // Check if cab exixts
    const cab = yield CabModel.findOne({
        cabRegistrationNumber,
    });
    // If cab not exixsts return an error
    if (!cab) {
        return createError(req, res, next, "Cab does not exist", 404);
    }
    // Check if cab is assigned to driver
    if (!cab.isAssigned) {
        return createError(req, res, next, "Driver already not assigned", 409);
    }
    // Set the status of cab
    yield CabModel.updateOne({ cabRegistrationNumber }, {
        $set: {
            isAssigned: false,
        },
    });
    // Update the driver
    yield DriverModel.updateOne({
        cabRegistrationNumber,
    }, {
        $set: {
            cabRegistrationNumber: null,
        },
    });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Driver unassigned successfully",
    });
});
// Delete cab details from the database using cabRegistrationNumber
export const deleteCab = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cabRegistrationNumber } = req.params;
    // Check if cab exists
    const cab = yield CabModel.findOne({
        cabRegistrationNumber,
    });
    // If cab not exists return an error
    if (!cab) {
        return createError(req, res, next, "Cab does not exist", 404);
    }
    // Check if cab is assigned to driver
    if (cab.isAssigned) {
        // Update the driver
        yield DriverModel.updateOne({
            cabRegistrationNumber,
        }, {
            $set: {
                cabRegistrationNumber: null,
            },
        });
    }
    // Delete cab
    yield CabModel.deleteOne({
        cabRegistrationNumber,
    });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cab successfully deleted",
    });
});
// Get all the cabs which are assigned to any driver
export const getAllCabsWithDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all the cabs which are assigned to any driver
    const cabs = yield CabModel.find({
        isAssigned: true,
    });
    // If no cabs found return an error
    if (cabs.length === 0) {
        return createError(req, res, next, "No cabs found", 404);
    }
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cabs fetched successfully",
        data: cabs,
    });
});
// Get all the cabs which are not assigned to any driver
export const getAllCabsWithoutDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all the cabs which are not assigned to any driver
    const cabs = yield CabModel.find({
        isAssigned: false,
    });
    // If no cabs found return an error
    if (cabs.length === 0) {
        return createError(req, res, next, "No cabs found", 404);
    }
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cabs fetched successfully",
        data: cabs,
    });
});
// Update the cab details using cabRegistrationNumber
export const updateCab = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cabRegistrationNumber } = req.params;
    const { cabModel, cabColour } = req.body;
    // Check if cab exists
    const cab = yield CabModel.findOne({
        cabRegistrationNumber,
    });
    // If cab not exists return an error
    if (!cab) {
        return createError(req, res, next, "Cab not found", 404);
    }
    // Update the cab details
    yield CabModel.updateOne({
        cabRegistrationNumber,
    }, {
        $set: {
            cabModel,
            cabColour,
        },
    });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cab details updated successfully",
    });
});
// Update the cabRegistrationNumber of the cab
export const updateCabRegistrationNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cabRegistrationNumber } = req.params;
    const { newCabRegistrationNumber } = req.body;
    // Check if cab exists
    const cab = yield CabModel.findOne({
        cabRegistrationNumber,
    });
    // If cab not exists return an error
    if (!cab) {
        return createError(req, res, next, "Cab not found", 404);
    }
    // Update the cab details
    yield CabModel.updateOne({
        cabRegistrationNumber,
    }, {
        $set: {
            cabRegistrationNumber: newCabRegistrationNumber,
        },
    });
    // Send the response
    res.status(200).json({
        success: true,
        message: "Cab registration number updated successfully",
    });
});
