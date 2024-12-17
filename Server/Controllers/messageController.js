import Room from "../Model/Room.js";
import Message from "../Model/Message.js";
import User from "../Model/User.js";
import Participant from "../Model/Participant.js";
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

export const joinRoomController = async (req, res) => {
  const { room_name, invite_code } = req.body;

  try {
    const user_id = req.user_id; // Authenticated user ID

    // Unauthorized user check
    if (!user_id) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized user" });
    }

    if (
      !room_name ||
      typeof room_name !== "string" ||
      room_name.trim() === ""
    ) {
      return res.status(400).json({ message: "Room name is required" });
    }

    // Find the room
    const room = await Room.findOne({ where: { room_name } });
    if (!room) {
      return res
        .status(404)
        .json({ status: "error", message: "Room not found" });
    }

    // Validate invite_code for private rooms
    if (room.room_type === "private" && room.invite_code !== invite_code) {
      return res
        .status(403)
        .json({ status: "error", message: "Invalid invite code" });
    }

    // Check if the user is already in the room
    const existingMember = await Participant.findOne({
      where: { room_id: room.room_id, user_id },
    });
    console.log("Existing Member:", existingMember);
    if (existingMember) {
      return res
        .status(400)
        .json({ status: "error", message: "You are already in this room" });
    }

    // Add the user to the room
    const roomMember = await Participant.create({
      room_id: room.room_id,
      user_id,
      is_admin: 0, // Optional, defaults to 0 (not admin)
      is_blocked: false, // Optional, defaults to false (not blocked)
    });
  

    // Notify other users about the new member joining the room using Socket.IO
    const io = req.app.get("io"); // Make sure io instance is available
    if (io) {
      io.to(room.room_id).emit("user_joined", {
        user_id,
        room_name: room.room_name,
        message: `${user_id} has joined the room: ${room.room_name}`,
      });
    } else {
      console.error("Socket.io instance not available");
    }

    return res.status(200).json({
      status: "success",
      message: "Joined room successfully",
      room: {
        room_id: room.room_id,
        room_name: room.room_name,
        room_type: room.room_type,
        user_id,
      },
    });
  } catch (error) {
    console.error("Error joining room:", error.message || error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};
