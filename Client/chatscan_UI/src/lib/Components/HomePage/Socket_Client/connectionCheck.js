import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  auth: {
    token: "your-jwt-tokeneyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhbnVqc2hhcm1haWl0Ym9tYmF5MjAyNEBnbWFpbC5jb20iLCJpYXQiOjE3MzM5Nzg0MzUsImV4cCI6MTczMzk4MjAzNX0.IgvokmsSs0RADvkPoaz2Ro2YyF_8FzmBzxN-crYDqBk", // Replace with your actual token
  },
});

socket.on("connect", () => {
  console.log("Connected to WebSocket!");
});

socket.on("notification", (data) => {
  console.log("Notification:", data);
});

socket.on("error", (err) => {
  console.error("Error:", err);
});
