import jwt from "jsonwebtoken";
import User from "../Model/User.js";

const socketAuthMiddleware = async (socket, next) => {
  const authHeader =
    socket.handshake.auth.token || socket.handshake.headers.token;
  console.log("Received token:", authHeader);

  if (!authHeader) {
    return next(
      new Error("Authentication error: No token provided in handshake")
    );
  }

  try {
    const token = authHeader;

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.user = user;
    console.log("User info from DB:", socket.user);

    return next();
  } catch (error) {
    console.error("Token error:", error);
    if (error.name === "TokenExpiredError") {
      return next(new Error("Authentication error: Token expired"));
    }
    return next(new Error("Authentication error: Invalid token"));
  }
};

export default socketAuthMiddleware;
