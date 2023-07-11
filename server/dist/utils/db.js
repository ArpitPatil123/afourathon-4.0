var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connect = yield mongoose.connect((_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : "");
    console.log(`MongoDB connected: ${connect.connection.host}`);
});
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
