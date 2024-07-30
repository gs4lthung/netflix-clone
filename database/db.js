import mongoose from "mongoose";
import { ENV_VARS } from "../backend/config/envVars.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB: " + error.message);
    process.exit(1);
  }
};
