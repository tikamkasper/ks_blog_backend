const mongoose = require("mongoose");
const { MONGODB_URI, DB_NAME } = require("../config");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection failed.", "\n", error);
    process.exit(1);
  }
};

module.exports = connectDB;
