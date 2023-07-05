import mongoose from "mongoose";
// Creating the driver schema
const driverSchema = new mongoose.Schema({
    driverId: {
        type: Number,
        required: true,
        unique: true,
    },
    driverName: {
        type: String,
        required: [true, "Please enter your name"],
    },
    driverEmail: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    driverPhone: {
        type: String,
        required: [true, "Please enter your phone number"],
        unique: true,
        maxlength: 10,
        minlength: 10,
    },
    cabId: {
        // cabId is the foreign key
        type: String,
        unique: true,
        default: null,
    },
});
// Creating the driver model
const DriverModel = mongoose.model("Driver", driverSchema);
export default DriverModel;