<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import io from "socket.io-client";
  import { chatHistory } from "../../../../store";

  export let room_id;

  let message = "";
  let messages = [];
  let token = localStorage.getItem("jwtToken");
  let socket;

  const currentUserId = "Me"; 

  onMount(() => {
   
    messages = $chatHistory.map((msg) => ({
      sender_id: msg.sender_id,
      message: msg.message,
      timestamp: msg.timestamp || new Date(), 
      showName: false, 
    }));

    if (token) {
      socket = io("http://localhost:4000", {
        transports: ["websocket"],
        auth: { token },
      });

      socket.emit("join_room", room_id);

     
      socket.on("user_joined", (data) => {
        messages = [
          ...messages,
          { system: true, message: data.message, sender_id: "system" },
        ];
      });

     
      socket.on("receive_message", (data) => {
        messages = [
          ...messages,
          {
            sender_id: data.sender_id,
            user_name: data.user_name, 
            message: data.message,
            timestamp: data.timestamp,
            showName: true, 
          },
        ];
      });

      socket.on("previous_chat_messages", (newMessages) => {
        const formattedMessages = newMessages.map((msg) => ({
          sender_id: msg.sender_id,
          message: msg.message,
          timestamp: msg.createdAt,
          showName: false, 
        }));
        $chatHistory = [...$chatHistory, ...formattedMessages];
        // messages = [...messages, ...formattedMessages];
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  });

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender_id: currentUserId,
        message,
        timestamp: new Date().toISOString(),
        showName: true, 
      };
      messages = [...messages, newMessage];

      socket.emit("send_message", { room_id, message });

      message = "";
    }
  };

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
    <button class="exit-btn" on:click={() => navigate("/home")}>Exit Room</button>
  </div>

  <div class="messages">
    {#each messages as msg}
      {#if msg.system}
        <div class="message system">{msg.message}</div>
      {:else}
        <div class="message {msg.sender_id === currentUserId ? 'me' : 'user'}">
          {#if msg.sender_id === currentUserId}
            <p>{msg.message}</p>
          {:else if msg.showName}
            <strong>{msg.user_name}:</strong> {msg.message}
          {:else}
            <strong>User {msg.sender_id}:</strong> {msg.message}
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
    height: 100vh;
    max-width: 400px;
    margin: 0 auto;
    background-color: #2a3b58;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  
  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #3d4d6c;
    color: white;
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
    flex-grow: 1;
    padding: 15px;
    background-color: #f5f5f5;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .message {
    max-width: 70%;
    padding: 10px;
    border-radius: 8px;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  /* Styling for your messages */
  .message.me {
    align-self: flex-end;
    background-color: #007bff;
    color: white;
    text-align: right;
  }

  .message.user {
    align-self: flex-start;
    display: flex;
    gap: 10px;
    background-color: #e1f5fe;
    color: black;
  }
  
  /* Styling for system messages */
  .message.system {
    align-self: center;
    font-style: italic;
    color: gray;
  }
  
  .input-area {
    display: flex;
    padding: 10px;
    background-color: #3d4d6c;
    border-top: 1px solid #ccc;
  }

  input {
    flex-grow: 1;
    padding: 10px;
    border: none;
    border-radius: 20px;
    margin-right: 10px;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
  }

  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
  
  </style>
  