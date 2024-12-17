import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { verifyToken } from "./Middlewares/verifyToken.js";
import { joinRoomController } from "./Controllers/messageController.js";
import userRoutes from "./Routes/loginRoutes.js";
import createRoute from "./Routes/createRoute.js";
import fetchRoomRoute from "./Routes/RoomRoutes/fetchRoomRoutes.js";
import socketAuthMiddleware from "./Middlewares/socketAuthMiddleware.js";
import sequelize from "./Database/db.js";

dotenv.config(); // Load environment variables

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});
app.set("io", io);
// Set up Socket.IO authentication middleware
io.use(socketAuthMiddleware);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.user_id}`);

  // Handle messaging logic
  try {
    messageController(socket, io);
    sendMessageHandler(socket, io);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.user_id}`);
    });
  } catch (error) {
    console.error("Error handling socket connection:", error);
  }
});

// Express Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/create", createRoute);
app.use("/", fetchRoomRoute);
app.post("/joinRoom", verifyToken, joinRoomController);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

// Start server after DB sync
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  httpServer.close(() => {
    console.log("Server closed.");
    sequelize.close(); // Close database connection (optional)
    process.exit(0);
  });
});
