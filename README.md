# ChatScan

ChatScan is a real-time chat application built with Svelte for the frontend and Node.js with Express and Socket.IO for the backend. It supports user authentication, room creation, and real-time messaging.

## Features

- User Authentication (Login, Register, Logout)
- Create and Join Chat Rooms
- Real-time Messaging
- Public and Private Rooms
- JWT-based Authentication
- Persistent Chat History

## Project Structure
   ### Client

The client-side code is located in the `Client/chatscan_UI` directory and is built using Svelte and Vite.

### Server

The server-side code is located in the `Server` directory and is built using Node.js, Express, and Socket.IO.

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-repo/chatscan.git
cd chatscan

```
Install dependencies:

```bash
 npm install
```
Start the development server:
```bash
 npm start
```
### Usage
## User Authentication
- Register a new account.
- Login with your credentials.
- Logout to end the session.
## Chat Rooms
- Create a new public or private chat room.
- Join an existing chat room.
- Send and receive real-time messages.
### API Endpoints
## User Routes 
- POST /users/signup - Register a new user.
- POST /users/login - Login a user.
- POST /users/logout - Logout a user.
## Room Routes 
- POST /create/room - Create a new chat room.
- GET /rooms - Fetch all chat rooms.
- POST /joinRoom - Join a chat room.
### WebSocket Event 
## Client to Server 
- join_room - Join a chat room.
- send_message - Send a message to a chat room.
### Server to Client
- user_joined - Notify when a user joins a room.
- receive_message - Receive a new message.
- previous_chat_messages - Receive chat history.
### Screenshot
Login page 
![login](https://github.com/user-attachments/assets/28b2becb-cbf0-4fff-a382-4756f204ee86)
Sign up page
![signup_page](https://github.com/user-attachments/assets/656bdb8a-ddf9-427a-a1e0-5553a2ed01e0)
Room 
![room](https://github.com/user-attachments/assets/5feab44c-1900-4f85-9d52-ae4d10f4a5c9)
chatRoom
![chat_room](https://github.com/user-attachments/assets/edb8afb1-7465-4b36-86b3-085837818567)




### Contributing
Contributions are welcome! Please open an issue or submit a pull request
### Licence 
This project is licensed under the MIT License.
    
