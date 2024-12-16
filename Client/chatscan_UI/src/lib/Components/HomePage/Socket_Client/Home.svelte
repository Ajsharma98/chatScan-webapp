<script>
    import { onMount } from "svelte";
    import { getIdFromToken } from "../../../../modules/idfromToken"; 
    import { io } from "socket.io-client";// Path to your utility function
  
    let user = { user_id: null }; // Store the user data (user_id will come from the token)
    let roomName = "";
    let roomType = "public"; // Default to "public"
    let joinRoomId = ""; // ID for the room to join
    let token = ""; // Store the JWT token
  
    onMount(async () => {
      // Fetch user ID and token when the component mounts
      try {
        token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("Token not found. Please log in again.");
  
        const tokenData = await getIdFromToken();
        if (tokenData) {
          user = tokenData;
        } else {
          alert("Failed to retrieve user data.");
        }
      } catch (error) {
        console.error("Error getting user ID:", error);
        alert("Error retrieving user information. Redirecting to login.");
        window.location.href = "/login"; // Redirect to login if token is missing or invalid
      }
    });
  
    // Function to create a room
    async function createRoom() {
      try {
        const response = await fetch("http://localhost:4000/create/room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token here
          },
          body: JSON.stringify({
            room_name: roomName,
            room_type: roomType,
            owner_id: user.user_id, // Using user_id from the decoded token
          }),
        });
  
        if (!response.ok) {
          throw new Error(await response.text());
        }
  
        const data = await response.json();
        alert(`Room created successfully. ${data.room.invite_code ? `Invite code: ${data.room.invite_code}` : ""}`);
      } catch (error) {
        console.error("Failed to create room:", error);
        alert("Failed to create room.");
      }
    }
  
    // Function to join a room
    async function joinRoom() {
      try {
        const socket = io(); // Assuming Socket.IO is connected
        socket.emit("join room", { room_id: joinRoomId, token });
  
        socket.on("notification", (message) => {
          alert(`Joined room: ${message.message}`);
        });
  
        socket.on("error", (error) => {
          alert(`Error: ${error.message}`);
        });
      } catch (error) {
        console.error("Failed to join room:", error);
        alert("Failed to join room.");
      }
    }
  </script>
  
  <div class="profile">
    <p><strong>User ID:</strong> {user.user_id || "Loading..."}</p>
  </div>
  
  <div class="container">
    <!-- Create Room Section -->
    <div>
      <h2>Create Room</h2>
      <form on:submit|preventDefault={createRoom}>
        <input
          type="text"
          placeholder="Room Name"
          bind:value={roomName}
          required
        />
        <select bind:value={roomType}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button type="submit">Create Room</button>
      </form>
    </div>
  
    <!-- Join Room Section -->
    <div>
      <h2>Join Room</h2>
      <form on:submit|preventDefault={joinRoom}>
        <input
          type="text"
          placeholder="Room ID"
          bind:value={joinRoomId}
          required
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  </div>
  
  <style>
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
    }
  
    .profile {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: #f0f0f0;
      padding: 0.5rem 1rem;
      border-radius: 5px;
    }
  
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 300px;
      width: 100%;
    }
  
    button {
      padding: 0.5rem 1rem;
      background-color: #6200ee;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #3700b3;
    }
  </style>
  