import jwt from "jsonwebtoken";
import User from "../Model/User.js";

const socketAuthMiddleware = async (socket, next) => {
  // Extract token from the Authorization header
  const authHeader = socket.handshake.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new Error("Authentication error: No token provided in handshake")
    );
  }

  // Extract the token by splitting the header
  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach limited user data to the socket object
    socket.user = user;
    console.log(socket.user);

    // Proceed to the next middleware/handler
    return next();
  } catch (error) {
    // Handle token errors
    if (error.name === "TokenExpiredError") {
      return next(new Error("Authentication error: Token expired"));
    }
    return next(new Error("Authentication error: Invalid token"));
  }
};

export default socketAuthMiddleware;
