<script>
    import CreateRoomModal from "./CreateRoomModal.svelte";
     import JoinRoomModal from "./JoinRoomModal.svelte";
    let showCreateRoomModal = false;
    let showJoinRoomModal = false;
  
    function handleSuccess(event) {
      console.log(event.detail); // Handle success if needed
      closeModel();
    }
  
    function closeModel() {
      showCreateRoomModal = false;
      showJoinRoomModal = false;
    }
  </script>
  
  <style>
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  
    .button-container {
      display: flex;
      gap: 20px;
    }
  
    button {
      padding: 15px;
      font-size: 1.2rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
  
    .button-container button:hover {
      background-color: #0056b3;
    }
  </style>
  
  <div class="container">
    <div class="button-container">
      <button on:click={() => (showCreateRoomModal = true)}>Create Room</button>
      <button on:click={() => (showJoinRoomModal = true)}>Join Room</button>
    </div>
  </div>
  
  <!-- Create Room Modal -->
  {#if showCreateRoomModal}
    <CreateRoomModal on:success={handleSuccess} on:close={closeModel} />
  {/if}
  
  <!-- Join Room Modal -->
  {#if showJoinRoomModal}
    <JoinRoomModal on:close={closeModel} />
  {/if}
  