import express from "express";
const router = express.Router();
import {
  createRoomController,
  saveMessage,
} from "../Controllers/messageController.js";

import { verifyToken } from "../Middlewares/verifyToken.js";

router.post("/room", verifyToken, createRoomController);
router.post("/save", verifyToken, saveMessage);

export default router;
