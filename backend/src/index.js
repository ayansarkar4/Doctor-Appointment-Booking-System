import dotenv from "dotenv";
import app from "./app.js";

import connectToDb from "./db/index.js";
import connectCloudinary from "./utils/cloudinary.js";
// Import the Express app

dotenv.config({
  path: "./.env",
}); // Load environment variables
connectCloudinary();

connectToDb()
  .then(() => {
    app.on("error", (err) => {
      console.error(`Server error: ${err.message}`);
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO DB connection failed:", err);
  });
