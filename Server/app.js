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
import Message from "./Model/Message.js";

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

io.use(socketAuthMiddleware); // authorizing the socket connection
io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.user.user_id}`);
  console.log(`User connected:${socket.user.display_name}`);

  socket.on("join_room", async (roomId) => {
    // console.log(`Raw data received in join_room:`, roomId);
    console.log(`User ${socket.user.display_name} joining room: ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user_joined", {
      user_id: socket.user.user_id,
      room_name: roomId,
      message: ` ${socket.user.display_name} has joined the room ${roomId}.`,
    });
    console.log(
      `User ${socket.user.display_name} has joined the room ${roomId}.`
    );
    try {
      const messages = await Message.findAll({
        where: { room_id: roomId },
        order: [["createdAt", "ASC"]],
        attributes: ["sender_id", "message", "createdAt"],
      });
      socket.emit("previous_chat_messages", messages);
      
    } catch (error) {
      console.error("Error fetching messages:", error);
    
    }
  });

  socket.on("send_message", async (data) => {
    const { room_id, message } = data;
    try {
      console.log(
        `Message from User ${socket.user.display_name} in Room ${room_id}: ${message}`
      );

      await Message.create({
        sender_id: socket.user.user_id,
        room_id,
        message,
      });

      socket.broadcast.to(room_id).emit("receive_message", {
        user_name: socket.user.display_name,
        user_id: socket.user.user_id,
        message,
        timestamp: new Date(),
      });
      // console.log(socket.user.display_name);
      console.log("Message saved to database successfully");
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error_message", {
        error: "Failed to send the message.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.display_name}`);
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
  .sync({ alter: true })
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
