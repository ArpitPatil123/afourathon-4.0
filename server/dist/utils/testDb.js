// Create a mongodb memory server instance and connect to it using the mongo client and then use the mongo client to connect to the database
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Path: server\src\utils\testDb.ts
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
let mongoServer;
let connection; // type of connection is Connection
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = yield mongoose.connect(uri);
});
const dropDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (connection) {
        yield mongoose.connection.dropDatabase();
        yield mongoose.connection.close();
    }
    if (mongoServer) {
        yield mongoServer.stop();
    }
});
const dropCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoServer) {
        const collections = yield mongoose.connection.db.collections();
        for (let collection of collections) {
            yield collection.drop();
        }
    }
});
export { connectDB, dropDB, dropCollections };
