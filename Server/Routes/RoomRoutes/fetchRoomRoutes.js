import express from "express";
const router = express.Router();
import { getAllRooms } from "../../Controllers/roomController.js";
import { verifyToken } from "../../Middlewares/verifyToken.js";

router.get("/rooms", verifyToken, getAllRooms);
export default router;
