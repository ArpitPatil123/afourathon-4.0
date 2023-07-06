import mongoose from "mongoose";
import { Cab } from "../utils/types.js";

const cabSchema = new mongoose.Schema({
  cabRegistrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cabModel: {
    type: String,
    required: true,
  },
  cabColour: {
    type: String,
    required: true,
  },
  driverId: {
    type: Number,
    required: true,
    default: null,
  },
});

const CabModel = mongoose.model<Cab>("Cab", cabSchema);

export default CabModel;
