import mongoose from "mongoose";

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONGODB_URI ?? "");
  console.log(`MongoDB connected: ${connect.connection.host}`);
};

// Check if the mongoose connection is closed if yes then connect again
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
  connectDB();
});

// If there is an error in connecting to the database then exit the process
mongoose.connection.on("error", (err) => {
  console.log(`MongoDB connection error: ${err}`);
  connectDB();
});

// If the connection is successful then log it
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

export default connectDB;

// ac-vfkpkdu-shard-00-00.d9xd50h.mongodb.net
