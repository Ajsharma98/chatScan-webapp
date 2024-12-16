import Room from "../Model/Room.js";
import Message from "../Model/Message.js";
import User from "../Model/User.js";
import { v4 as uuidv4 } from "uuid"; // To generate unique invite codes

export const createRoomController = async (req, res) => {
  const { room_name, room_type } = req.body;

  try {
    // Ensure the authenticated user's ID is available
    const { user_id } = req.user;

    if (!user_id) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized user" });
    }

    // Check if the user exists in the User table (optional)
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Generate invite code if room is private
    const invite_code = room_type === "private" ? uuidv4() : null;

    // Create the room
    const newRoom = await Room.create({
      room_name,
      room_type,
      owner_id: user_id,
      invite_code, // Include the invite code for private rooms
      latest_message: "", // Default to empty
      Status: "Clean", // Default status
    });

    return res.status(201).json({
      status: "success",
      message: "Room created successfully",
      room: {
        room_id: newRoom.room_id,
        room_name: newRoom.room_name,
        room_type: newRoom.room_type,
        invite_code: newRoom.invite_code, // Only for private rooms
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

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
