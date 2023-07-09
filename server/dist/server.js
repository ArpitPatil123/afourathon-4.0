// Importing required packages
import app from "./app.js";
import connectDB from "./utils/db.js";
// Initializing the port
const PORT = process.env.PORT || 3000; // Setting the port
if (process.env.NODE_ENV !== "test") {
    connectDB();
}
// Starting the server
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
    // Connecting to the database if the environment is not test
});
