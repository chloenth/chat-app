# Chat App

A real-time chat application built using React for the frontend and Node.js with Socket.IO for the backend.

## Features

- Real-time messaging with **Socket.IO**
- User authentication (**JWT-based**, stored in **cookies**)
- Online/offline status tracking
- Profile management with **Cloudinary** image upload
- Responsive UI with **TailwindCSS & DaisyUI**

## Tech Stack

### Frontend

- **React (Vite)**
- **Zustand (for state management)**
- **Axios**
- **TailwindCSS & DaisyUI**
- **React Router**
- **Socket.IO Client**

### Backend

- **Node.js (Express.js)**
- **MongoDB Atlas & Mongoose**
- **Cloudinary (for profile image uploads)**
- **JWT Authentication (stored in HTTP-only cookies)**
- **Socket.IO**
- **Multer (for handling file uploads)**

## Installation & Setup

### Prerequisites

- Node.js & npm installed
- MongoDB running locally or via MongoDB Atlas

### Clone the Repository

```sh
  git clone https://github.com/chloenth/chat-app.git
  cd chat-app
```

### Backend Setup

```sh
    cd backend
    npm install
```

**Configure environment variables**:
Create a .env file in the backend folder:

```sh
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    COOKIE_SECRET=your_cookie_secret
```

Start the backend server:

```sh
   npm run dev
```

### Frontend Setup

```sh
    cd ../frontend
    npm install
```

Start the frontend server:

```sh
   npm run dev
```

## Usage

- Open `http://localhost:5173` in your browser.
- Register or log in to start chatting.
- Users can send messages in real time.
- Profile pictures can be uploaded and updated via Cloudinary.

## API Endpoints (Backend)

| **Method**   | **Endpoint**                      | **Description**                                                            |
| ------------ | --------------------------------- | -------------------------------------------------------------------------- |
| **Auth**     |                                   |                                                                            |
| POST         | PUBLIC `/api/auth/signup`         | Register a new user & return JWT (stored in cookies).                      |
| POST         | PUBLIC `/api/auth/login`          | Login user & return JWT (stored in cookies).                               |
| POST         | PUBLIC `/api/auth/logout`         | Logout user & remove JWT from cookie.                                      |
| PUT          | PUBLIC `/api/auth/update-profile` | Updates the user’s profile image.                                          |
| GET          | PRIVATE `/api/auth/check`         | Check if user request has token stored in cookie.                          |
| **Messages** |                                   |                                                                            |
| GET          | PRIVATE `/api/messages/users`     | Get all users except the logged in user.                                   |
| GET          | PRIVATE `/api/messages/:id`       | Get all messages for a chat between selected user and logged in user.      |
| POST         | PRIVATE `/api/messages/send/:id`  | Send message of logged in user as sender to the selected user as receiver. |

## WebSocket Events

| **Event**        | **Description**                                                     |
| ---------------- | ------------------------------------------------------------------- |
| `getOnlineUsers` | Send the userSocketMap (online users) to all the connected clients. |
| `newMessage`     | Broadcast an new message event to the receiver if they are online.  |

## License

This project is open-source and available under the MIT License.
