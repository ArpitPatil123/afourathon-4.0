import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
export const registerUser = async (req, res, next) => {
    const { name, email, password, phone, cnfPassword } = req.body;
    // Check if all the fields are present
    if (!name || !email || !password || !phone || !cnfPassword) {
        return createError(req, res, next, "Please provide all the details", 400);
    }
    // Check if the phone number is valid
    if (phone.length !== 10) {
        return createError(req, res, next, "Please provide a valid phone number", 400);
    }
    // Check if the password and confirm password are same
    if (password !== cnfPassword) {
        return createError(req, res, next, "Password and Confirm Password doesn't match", 400);
    }
    // Check if the user already exists if the user exists, return an error Else, create a new user
    const user = await UserModel.findOne({ email: email });
    if (user?.phone === phone) {
        return createError(req, res, next, "Phone number already exists", 409);
    }
    if (user) {
        return createError(req, res, next, "User already exists", 409);
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new UserModel({
        name,
        email,
        password: hashPassword,
        phone,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: savedUser,
    });
};
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    // Check if all the fields are present
    if (!email || !password) {
        return createError(req, res, next, "Please provide all the details", 400);
    }
    // Check if the user exists
    const user = await UserModel.findOne({ email: email });
    if (!user) {
        return createError(req, res, next, "User doesn't exist", 404);
    }
    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return createError(req, res, next, "Invalid password", 400);
    }
    // Create and assign a token
    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.TOKEN_SECRET);
    // Set token in cookie
    res.cookie("auth-token", token, {
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
    });
};
