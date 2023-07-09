// Create a mongodb memory server instance and connect to it using the mongo client and then use the mongo client to connect to the database

// Path: server\src\utils\testDb.ts
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;
let connection: any; // type of connection is Connection

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  connection = await mongoose.connect(uri);
};

const dropDB = async () => {
  if (connection) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
};

const dropCollections = async () => {
  if (mongoServer) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
  }
};

export { connectDB, dropDB, dropCollections };
