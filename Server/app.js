import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import cors from "cors";
import "./Model/index.js";
import sequelize from "./Database/db.js";
const app = express();
app.use(express.urlencoded({ extended: true })); // For HTML form submission or key-value pair data
app.use(
  cors({
    origin: "http://localhost:5173", // URL of the frontend
    credentials: true, // Include cookies and session for authorization
  })
);

app.use(express.json());
const PORT = process.env.PORT || 4000;

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      // Start the server
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
