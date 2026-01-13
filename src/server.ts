import app from "./app";
import { env } from "./config/env.config";
import { connectDB } from "./config/db.config";

const startServer = async () => {
  try {
    // MongoDB
    connectDB();


    // Server
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
    
  } catch (error) {
    console.error("❌ Server startup failed", error);
    process.exit(1);
  }
};

startServer();
