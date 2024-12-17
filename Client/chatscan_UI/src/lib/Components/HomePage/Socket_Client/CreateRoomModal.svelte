<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let room_name = '';
  let room_type = 'public'; // Default room type
  let errorMessage = '';
  let successMessage = '';
  let invite_code = ''; // To store invite code for private rooms
  let isLoading = false; // Loading state

  async function handleCreateRoom() {
    if (room_name.trim() === '') {
      errorMessage = 'Room name is required.';
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      errorMessage = 'You must be logged in to create a room.';
      return;
    }

    errorMessage = '';
    isLoading = true;

    try {
      const response = await fetch('http://localhost:4000/create/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room_name, room_type }),
      });

      isLoading = false;

      if (response.ok) {
        const data = await response.json();

        if (room_type === 'private') {
          invite_code = data.room.invite_code;
          window.alert(`Private Room Created! Share this invite code: ${invite_code}`);
        } else {
          successMessage = 'Public Room Created Successfully!';
        }

        dispatch('success', data); // Notify parent
      } else {
        const error = await response.text();
        errorMessage = error || 'Failed to create the room.';
      }
    } catch (err) {
      isLoading = false;
      errorMessage = 'An error occurred while creating the room.';
    }
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<div class="modal">
  <div class="modal-content">
    <h3>Create Room</h3>
    <input type="text" placeholder="Enter Room Name" bind:value={room_name} aria-label="Room Name" />
    <select bind:value={room_type} aria-label="Room Type">
      <option value="public">Public</option>
      <option value="private">Private</option>
    </select>

    {#if isLoading}
      <p>Loading...</p>
    {/if}

    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}

    {#if successMessage}
      <p class="success-message">{successMessage}</p>
    {/if}

    {#if invite_code}
      <p class="invite-code">Invite Code: {invite_code}</p>
    {/if}

    <button class="cancel-button" on:click={handleClose}>Cancel</button>
    <button on:click={handleCreateRoom}>Create Room</button>
  </div>
</div>

<style>
  .success-message {
    color: green;
    margin-top: 15px;
    font-size: 1.1rem;
  }

  .error-message {
    color: red;
    margin-top: 15px;
    font-size: 1.1rem;
  }

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
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
  }

  button {
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .cancel-button {
    background-color: #dc3545;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
  }

  .invite-code {
    color: blue;
    font-weight: bold;
  }
</style>
