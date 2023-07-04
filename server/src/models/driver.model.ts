import mongoose from "mongoose";
import { Driver } from "../utils/types";

// Creating the driver schema
const driverSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "Please enter your phone number"],
    unique: true,
    maxlength: 10,
    minlength: 10,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
});

// Creating the driver model
const Driver = mongoose.model<Driver>("Driver", driverSchema);

export default Driver;
