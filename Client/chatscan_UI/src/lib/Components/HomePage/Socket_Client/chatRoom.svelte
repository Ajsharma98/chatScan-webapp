<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import io from "socket.io-client";

  export let room_id = "";
  let message = "";
  let messages = [];
  let token = localStorage.getItem("jwtToken");
  let socket;

  onMount(() => {
    if (token) {
      socket = io("http://localhost:4000", {
        transports: ["websocket"],
        auth: { token },
      });

      socket.emit("join_room", room_id);

      socket.on("user_joined", (data) => {
        messages = [...messages, { system: true, message: data.message }];
      });

      socket.on("receive_message", (data) => {
        // Prevent adding your own sent message again
        if (data.user_id !== "Me") {
          messages = [
            ...messages,
            { user_id: data.user_id, message: data.message, timestamp: data.timestamp },
          ];
        }
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  });

  const sendMessage = () => {
    if (message.trim()) {
      // Display your message on the UI immediately
      const newMessage = { user_id: "Me", message, timestamp: new Date().toISOString() };
      messages = [...messages, newMessage];

      // Send message to the server
      socket.emit("send_message", { room_id, message });

      // Clear input field
      message = "";
    }
  };

  // Auto-scroll when new message is added
  $: {
    const messagesContainer = document.querySelector(".messages");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
</script>

<div class="chat-room">
  <div class="room-header">
    <h2>Room: {room_id}</h2>
    <button class="exit-btn" on:click={() => navigate('/home')}>Exit Room</button>
  </div>

  <div class="messages">
    {#each messages as msg}
      {#if msg.system}
        <div class="message system">{msg.message}</div>
      {:else}
        <div class="message {msg.user_id === 'Me' ? 'me' : 'user'}">
          {#if msg.user_id === 'Me'}
            <p>{msg.message}</p>
          {:else}
            <strong>{msg.user_id}:</strong> {msg.message}
          {/if}
        </div>
      {/if}
    {/each}
  </div>

  <div class="input-area">
    <input
      type="text"
      placeholder="Type your message..."
      bind:value={message}
      on:keydown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button on:click={sendMessage}>Send</button>
  </div>
</div>




<style>
  .chat-room {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh; /* Occupy full screen height */
    max-width: 600px; /* Constrain width for central layout */
    margin: 20px auto; /* Center chat room */
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    background-color: #8d6060;
  }
  
  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .room-header h2 {
    font-size: 1.5rem;
    margin: 0;
  }
  
  .exit-btn {
    padding: 0.5rem;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .exit-btn:hover {
    background-color: #cc3333;
  }
  
  .messages {
    flex-grow: 1; /* Allow messages to grow and shrink to fill available space */
    overflow-y: auto; /* Add scrolling for overflow content */
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    background-color: #fff;
    border-radius: 8px;
    max-height: 400px; /* Limit maximum height */
    display: flex;
    flex-direction: column; /* Stack messages vertically */
    gap: 10px; /* Add space between messages */
  }
  
  .message {
    max-width: 70%;
    padding: 10px;
    border-radius: 10px;
    word-wrap: break-word;
    font-size: 1rem;
  }
  
  /* Styling for your messages */
  .message.me {
    align-self: flex-end; /* Push to the right */
    background-color: #daf7dc;
    text-align: right;
  }
  
  /* Styling for others' messages */
  .message.user {
    align-self: flex-start; /* Push to the left */
    background-color: #f1f0f0;
    text-align: left;
  }
  
  /* Styling for system messages */
  .message.system {
    align-self: center;
    color: gray;
    font-style: italic;
  }
  
  .input-area {
    display: flex;
    margin-top: 10px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    align-items: center;
  }
  
  input {
    width: 85%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  button {
    padding: 10px 15px;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  </style>
  