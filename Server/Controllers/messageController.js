import Room from "../Model/Room.js";
import Message from "../Model/Message.js";
import User from "../Model/User.js";
import Participant from "../Model/Participant.js";
import { v4 as uuidv4 } from "uuid"; 

export const createRoomController = async (req, res) => {
  const { room_name, room_type } = req.body;

  try {
    const { user_id } = req.user;

    if (!user_id) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized user" });
    }

    
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

  
    const invite_code = room_type === "private" ? uuidv4() : null;

   
    const newRoom = await Room.create({
      room_name,
      room_type,
      owner_id: user_id,
      invite_code, 
      latest_message: "", 
      Status: "Clean", 
    });

    return res.status(201).json({
      status: "success",
      message: "Room created successfully",
      room: {
        room_id: newRoom.room_id,
        room_name: newRoom.room_name,
        room_type: newRoom.room_type,
        invite_code: newRoom.invite_code, 
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
    console.log("Received join room event", room_id); 
    try {
      const room = await Room.findByPk(room_id); 
      if (!room) {
        console.log("Room not found:", room_id);
        socket.emit("error", { status: 404, message: "Room not found" });
        return;
      }

      socket.join(room_id); 
      console.log(`User ${socket.user.id} joined room ${room_id}`); 

      socket.to(room_id).emit("notification", {
        status: 200,
        message: `User ${socket.user.id} joined the room`, 
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
      const room = await Room.findByPk(room_id); 
      if (!room) {
        socket.emit("error", { status: 404, message: "Room not found" });
        return;
      }

      const newMessage = await Message.create({
        sender_id: socket.user.user_id, 
        room_id,
        message,
      });

     
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
    const user_id = req.user_id; 

   
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

    
    const room = await Room.findOne({ where: { room_name } });
    if (!room) {
      return res
        .status(404)
        .json({ status: "error", message: "Room not found" });
    }

   
    if (room.room_type === "private" && room.invite_code !== invite_code) {
      return res
        .status(403)
        .json({ status: "error", message: "Invalid invite code" });
    }

   
    const existingMember = await Participant.findOne({
      where: { room_id: room.room_id, user_id },
    });
    console.log("Existing Member:", existingMember);
    if (existingMember) {
      return res
        .status(400)
        .json({ status: "error", message: "You are already in this room" });
    }

  
    const roomMember = await Participant.create({
      room_id: room.room_id,
      user_id,
      is_admin: 0, 
      is_blocked: false, 
    });

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
