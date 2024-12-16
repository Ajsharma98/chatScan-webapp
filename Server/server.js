import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// Create an Express app
const app = express();

// Create an HTTP server from the Express app
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  // options (if needed)
});

// Serve a simple endpoint
app.get("/", (req, res) => {
  res.send("Socket.IO server is running!");
});

// Listen for client connections on Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit a message to the client when they connect
  socket.emit("message", "Hello from the server!");

  // Listen for messages from the client
  socket.on("message", (data) => {
    console.log("Received from client:", data);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the HTTP server on port 3000
httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
