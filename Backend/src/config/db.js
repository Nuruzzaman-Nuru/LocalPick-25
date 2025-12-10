const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/localpick";

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected at ${uri}`);
    return { uri, inMemory: false };
  } catch (err) {
    // Fallback to an in-memory MongoDB instance so the app can run without a local Mongo installation.
    console.warn("MongoDB connection error:", err.message);
    console.warn("Starting in-memory MongoDB instance...");
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri("localpick");
    await mongoose.connect(memUri);
    console.log("Connected to in-memory MongoDB");
    return { uri: memUri, inMemory: true };
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
