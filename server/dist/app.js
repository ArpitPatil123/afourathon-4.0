// Importing required packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Importing required files
import errorHandler from "./middlewares/errorHandler.js";
// Importing routes
import auth_router from "./routes/auth.routes.js";
import driver_router from "./routes/driver.routes.js";
import cab_router from "./routes/cab.route.js";
// Initializing the express app
const app = express();
// Setting up the express app
dotenv.config();
// Middlewares
app.use(express.json());
app.use(cors({
    credentials: true,
}));
app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});
// Creating routes
app.use("/api/v4/auth", auth_router); // Authentication routes
app.use("/api/v4/driver", driver_router); // Driver routes
app.use("/api/v4/cab", cab_router); // Cab routes
// Global Error Handler
app.use(errorHandler);
export default app;
