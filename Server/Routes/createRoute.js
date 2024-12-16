import express from "express";
const router = express.Router();
import { createRoomController } from "../Controllers/messageController.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

router.post("/room", verifyToken, createRoomController);
export default router;
