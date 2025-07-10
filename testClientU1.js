const { io } = require("socket.io-client");

// Connect to your server (adjust the URL and port)
const socket = io("http://localhost:3008"); // change port if needed

const userId = "U1";
const roomId = "U1_U2"; // common room for 1-to-1 chat with U2

socket.on("connect", () => {
  console.log(`✅ ${userId} connected with ID: ${socket.id}`);

  // Join the room
  socket.emit("joinRoom", { roomId, userId });

  // Send a message to U2
  setTimeout(() => {
    socket.emit("sendMessage", {
      roomId,
      senderId: userId,
      message: "Hey U2, this is U1!",
    });
  }, 1000);
});

// Receive message from room
socket.on("receiveMessage", (data) => {
  console.log("📩 New message:", data);
});
