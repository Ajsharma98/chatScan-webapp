<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from "svelte";
  
    const dispatch = createEventDispatcher();
    
    let room_name = ''; 
    let rooms = [];  // Store the list of available rooms
    let invite_code = ''; // To store invite code if room is private
    let errorMessage = '';
    let successMessage = '';
  
    // Fetch available rooms from the database when the modal is opened
    onMount(async () => {
      try {
        const response = await fetch('http://localhost:4000/rooms', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Authorization token
          },
        });
  
        if (response.ok) {
        const data = await response.json();
        rooms=data.rooms
          console.log("here is the room",rooms); // rooms is now an array
        } else {
          throw new Error('Failed to fetch rooms.');
        }
      } catch (err) {
        errorMessage = 'Failed to load rooms.';
      }
    });
  
    async function handleJoinRoom() {
      if (room_name.trim() === '') {
        errorMessage = 'Room name is required.';
        return;
      }
      // Find the selected room in the list of rooms
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
          successMessage = 'Joined the room successfully!';
          dispatch('success', data); // Notify parent component of the successful join
        } else {
          const error = await response.json();
          errorMessage = error.message || 'Failed to join the room.';
        }
      } catch (err) {
        errorMessage = 'An error occurred while joining the room.';
      }
    }
  
    function handleClose() {
      dispatch('close');
    }
  
    function onRoomChange() {
      // Reset invite code when room selection changes
      const selectedRoom = rooms.find(room => room.room_name === room_name);
      if (selectedRoom && selectedRoom.room_type === 'private') {
        invite_code = ''; // Reset invite code for private rooms
      } else {
        invite_code = ''; // Reset invite code if room is public
      }
    }
    
</script>

<div class="modal">
    <div class="modal-content">
        <h3>Join Room</h3>
  
        <!-- Room Name Dropdown -->
        <select bind:value={room_name} on:change={onRoomChange}>
            <option value="" disabled selected>Select Room</option>
            {#each rooms as room (room.room_id)}
                <option value={room.room_name}>{room.room_name}</option>
            {/each}
        </select>
  
        <!-- Invite Code Field (Visible Only for Private Rooms) -->
        {#if room_name && rooms.find(room => room.room_name === room_name && room.room_type === 'private')}
            <input
                type="text"
                placeholder="Enter Invite Code"
                bind:value={invite_code}
            />
        {/if}
  
        <!-- Success Message -->
        {#if successMessage}
            <p class="success-message">{successMessage}</p>
        {/if}
  
        <!-- Error Message -->
        {#if errorMessage}
            <p class="error-message">{errorMessage}</p>
        {/if}
  
        <!-- Modal Buttons -->
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
  
  