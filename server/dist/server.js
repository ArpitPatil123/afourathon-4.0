// Importing required packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Importing required files
import connectDB from "./utils/db.js";
import errorHandler from "./middlewares/errorHandler.js";
// Importing routes
import auth_router from "./routes/auth.routes.js";
import driver_router from "./routes/driver.routes.js";
// Initializing the express app
const app = express();
const PORT = process.env.PORT || 3000; // Setting the port
// Setting up the express app
dotenv.config();
// Middlewares
app.use(express.json());
app.use(cors({
    credentials: true,
}));
// Connecting to the database
connectDB();
// Creating routes
app.use("/api/v4/auth", auth_router); // Authentication routes
app.use("/api/v4/driver", driver_router); // Driver routes
// Global Error Handler
app.use(errorHandler);
// Starting the server
const server = app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});
