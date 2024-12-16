import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import userRoutes from "./Routes/loginRoutes.js";
import createRoute from "./Routes/createRoute.js";
import socketAuthMiddleware from "./Middlewares/socketAuthMiddleware.js";
import {
  messageController,
  sendMessageHandler,
} from "./Controllers/messageController.js";
import sequelize from "./Database/db.js";
import { createRoomController } from "./Controllers/messageController.js";
dotenv.config(); // Load environment variables

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// WebSocket Server Setup
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.user_id}`);

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
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/create", createRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

// Database Sync and Server Startup
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
    process.exit(0);
  });
});
