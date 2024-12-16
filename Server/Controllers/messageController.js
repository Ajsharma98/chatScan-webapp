import Room from "../Model/Room.js";
import Message from "../Model/Message.js";

export const messageController = (socket, io) => {
  socket.on("join room", async ({ room_id }) => {
    console.log("Received join room event", room_id); // Add this log to check if the event is received
    try {
      const room = await Room.findByPk(room_id); // Check room existence
      if (!room) {
        console.log("Room not found:", room_id);
        socket.emit("error", { status: 404, message: "Room not found" });
        return;
      }

      socket.join(room_id); // User joins the room
      console.log(`User ${socket.user.id} joined room ${room_id}`); // Use socket.user.id

      socket.to(room_id).emit("notification", {
        status: 200,
        message: `User ${socket.user.id} joined the room`, // Notify others in the room
      });
    } catch (error) {
      console.error(error);
      socket.emit("error", { status: 500, message: "Failed to join room" });
    }
  });
};

export const sendMessageHandler = (socket, io) => {
  socket.on("send message", async ({ room_id, message }) => {
    try {
      const room = await Room.findByPk(room_id); // Check room existence
      if (!room) {
        socket.emit("error", { status: 404, message: "Room not found" });
        return;
      }

      const newMessage = await Message.create({
        sender_id: socket.user.user_id, // Use socket.user.id for sender
        room_id,
        message,
      });

      // Emit the new message to all users in the room
      io.to(room_id).emit("new message", {
        sender_id: socket.user.user_id,
        room_id,
        message: newMessage.message,
        timestamp: newMessage.createdAt,
      });
    } catch (error) {
      console.error(error);
      socket.emit("error", { status: 500, message: "Failed to send message" });
    }
  });
};
