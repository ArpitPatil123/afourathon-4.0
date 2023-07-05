import mongoose from "mongoose";
import { User } from "../utils/types";

// Creating the user schema
const userSchema = new mongoose.Schema({
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

// Creating the user model
const Driver = mongoose.model<User>("User", userSchema);

export default Driver;
