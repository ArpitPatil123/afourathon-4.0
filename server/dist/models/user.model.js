import mongoose from "mongoose";
// Creating the user schema
const userSchema = new mongoose.Schema({
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
        type: String,
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
const Driver = mongoose.model("User", userSchema);
export default Driver;
