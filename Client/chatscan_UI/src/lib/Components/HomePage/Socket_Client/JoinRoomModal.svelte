<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from "svelte";
  import { navigate } from "svelte-routing";
  import io from 'socket.io-client'; 
  import ChatRoom from "./ChatRoom.svelte";
  import {room_id, roomName, chatHistory} from "../../../../store";

  const dispatch = createEventDispatcher();
    
  let room_name = ''; 
  let rooms = []; 
  let invite_code = ''; 
  let errorMessage = '';
  let successMessage = '';
  let token = localStorage.getItem('jwtToken');
  let roomid='';
  let roomname='';
  let chathistory=[];

    
  let socket;
  

  onMount(() => {
    console.log("Token from localStorage:", token);

    if (token) {
      socket = io('http://localhost:4000', {
        transports: ['websocket'],
        auth: {
          token: token
        }
      });

    }
    return () => {
      if (socket) socket.disconnect();
    };
  });

  
  onMount(async () => {
    try {
      const response = await fetch('http://localhost:4000/rooms', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        rooms = data.rooms;
        console.log("Here are the rooms:", rooms); 
      } else {
        throw new Error('Failed to fetch rooms.');
      }
    } catch (err) {
      errorMessage = 'Failed to load rooms.';
    }
  });
  function handleClose() {
    dispatch('close');
  }
  function onRoomChange() {
    const selectedRoom = rooms.find(room => room.room_name === room_name);
    if (selectedRoom && selectedRoom.room_type === 'private') {
      invite_code = ''; 
    } else {
      invite_code = ''; 
    }
  };
  
  async function handleJoinRoom() {
    if (room_name.trim() === '') {
      errorMessage = 'Room name is required.';
      return;
    }
        
    const selectedRoom = rooms.find(room => room.room_name === room_name);
  
    if (selectedRoom && selectedRoom.room_type === 'private' && invite_code.trim() === '') {
      errorMessage = 'Invite code is required for private rooms.';
      return;
    }
  
    errorMessage = '';
    try {
      const response = await fetch('http://localhost:4000/joinRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({ room_name, invite_code }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        successMessage = 'Joined the room successfully!';
        dispatch('success', data);
        console.log(data.room.room_id)
        roomid=data.room.room_id;
        room_id.set(roomid)
        roomname=data.room.room_name
        roomName.set(roomname)
        console.log(roomName)
        // console.log("asdasdasd")
        // Emit join room event to server with room ID
        socket.emit('join_room', data.room.room_id);

        
        socket.on("user_joined", (data) => {
          console.log(`User joined: ${data.user_id} in room: ${data.room_name}`);
          window.alert(`${data.user_id} has joined the room: ${data.room_name}`);
        });
        chathistory = [...data.chatHistory];
        chatHistory.set(chathistory)
        console.log(chatHistory)
     
      
        // navigate(`/chat/${data.room.room_id}`);
        console.log(roomName)
  // console.log("asdasdasd")
      } else {
        const error = await response.json();
        errorMessage = error.message || 'Failed to join the room.';
      }
    } catch (err) {
      errorMessage = 'An error occurred while joining the room.';
    }
  }
  // console.log(roomName)
  // console.log("asdasdasd")
  // console.log(roomName)
  // console.log("roojhhj")
  // console.log(room_id)
</script>
<!-- <ChatRoom roomName= {roomName} room_id={room_id} chatHistory={chatHistory}/> -->


<div class="modal">
  <div class="modal-content">
    <h3>Join Room</h3>

    <select bind:value={room_name} on:change={onRoomChange}>
      <option value="" disabled selected>Select Room</option>
      {#each rooms as room (room.room_id)}
        <option value={room.room_name}>{room.room_name}</option>
      {/each}
    </select>

    {#if room_name && rooms.find(room => room.room_name === room_name && room.room_type === 'private')}
      <input type="text" placeholder="Enter Invite Code" bind:value={invite_code} />
    {/if}

    {#if successMessage}
      <p class="success-message">{successMessage}</p>
    {/if}

    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}

    <div class="modal-buttons">
      <button class="cancel-button" on:click={handleClose}>Cancel</button>
      <button class="join-button" on:click={handleJoinRoom}>Join Room</button>
    </div>
  </div>
</div>


  

  
  <style>
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
  
    .modal-content {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  
    h3 {
      margin-bottom: 20px;
      font-size: 1.5rem;
      text-align: center;
    }
  
    select, input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      font-size: 1rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  
    input:focus, select:focus {
      border-color: #007bff;
      outline: none;
    }
  
    .success-message,
    .error-message {
      font-size: 1rem;
      margin-top: 10px;
      text-align: center;
    }
  
    .success-message {
      color: green;
    }
  
    .error-message {
      color: red;
    }
  
    .modal-buttons {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  
    .cancel-button,
    .join-button {
      padding: 10px 20px;
      font-size: 1rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
    }
  
    .cancel-button {
      background-color: #f44336;
      color: white;
    }
  
    .join-button {
      background-color: #28a745;
      color: white;
    }
  
    .cancel-button:hover {
      background-color: #d32f2f;
    }
  
    .join-button:hover {
      background-color: #218838;
    }
  
    /* Responsive Styling */
    @media (max-width: 600px) {
      .modal-content {
        width: 90%;
        padding: 20px;
      }
  
      h3 {
        font-size: 1.3rem;
      }
  
      select, input {
        padding: 8px;
      }
  
      .modal-buttons {
        flex-direction: column;
        gap: 10px;
      }
  
      .cancel-button,
      .join-button {
        width: 100%;
      }
    }
  </style>
  
  