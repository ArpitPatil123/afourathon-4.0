import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res, next) => {
    const { name, email, password, id, phone, cnfPassword } = req.body;
    // Check if the password and confirm password are same
    if (password !== cnfPassword) {
        const error = {
            success: false,
            status: 401,
            message: "Password and confirm password doesn't match",
        };
        return next(error);
    }
    // Check if the user already exists if the user exists, return an error Else, create a new user
    const user = await UserModel.findOne({ email: email });
    if (user) {
        const error = {
            success: false,
            status: 409,
            message: "User already Exists",
        };
        return next(error);
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new UserModel({
        name,
        email,
        password: hashPassword,
        id,
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
    // Check if the user exists
    const user = await UserModel.findOne({ email: email });
    if (!user) {
        const error = {
            success: false,
            status: 404,
            message: "User not found",
        };
        return next(error);
    }
    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        const error = {
            success: false,
            status: 401,
            message: "Invalid password",
        };
        return next(error);
    }
    // Create and assign a token
    const token = jwt.sign({ _id: user._id, name: user.name, id: user.id }, process.env.TOKEN_SECRET);
    // Set token in cookie
    res.cookie("auth-token", token, {
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
    });
};
