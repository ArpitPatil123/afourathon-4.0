// Importing required packages
import { Server } from "http";
import app from "./app.js";

// Initializing the port
const PORT = process.env.PORT || 3000; // Setting the port

// Starting the server
const server: Server = app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
