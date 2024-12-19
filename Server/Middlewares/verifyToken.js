import jwt from "jsonwebtoken"; 
import User from "../Model/User.js";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = async (req, res, next) => {

  const authHeader = req.headers["authorization"]; 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {

    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  
  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "decoded token");
    const user_role = decoded.role;
    const user_id = decoded.id;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    req.user = user;
    req.user_id = user_id;
   
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
