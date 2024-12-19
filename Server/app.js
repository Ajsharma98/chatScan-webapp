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

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.use(socketAuthMiddleware);
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.user_id}`);

  socket.on("join_room", (roomId) => {
    console.log(`Raw data received in join_room:`, roomId);
    console.log(`User ${socket.user.user_id} joining room: ${roomId}`);
    socket.join(roomId);

    io.to(roomId).emit("user_joined", {
      user_id: socket.user.user_id,
      room_name: roomId,
      message: `User ${socket.user.user_id} has joined the room ${roomId}.`,
    });
    console.log(`User ${socket.user.user_id} has joined the room ${roomId}.`);
  });

  socket.on("send_message", (data) => {
    const { room_id, message } = data;

    console.log(
      `Message from User ${socket.user.user_id} in Room ${room_id}: ${message}`
    );

    io.to(room_id).emit("receive_message", {
      user_id: socket.user.user_id,
      message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.user_id}`);
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/create", createRoute);
app.use("/", fetchRoomRoute);
app.post("/joinRoom", verifyToken, joinRoomController);

app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

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

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  httpServer.close(() => {
    console.log("Server closed.");
    sequelize.close();
    process.exit(0);
  });
});
