import mongoose from "mongoose";
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
    isAssigned: {
        type: Boolean,
        default: false,
    },
});
const CabModel = mongoose.model("Cab", cabSchema);
export default CabModel;
