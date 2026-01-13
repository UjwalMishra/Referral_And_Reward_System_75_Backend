import mongoose from "mongoose";
import { env } from "./env.config";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection failed");
    process.exit(1);
  }
};
