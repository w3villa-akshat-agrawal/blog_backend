const { io } = require("socket.io-client");

const socket = io("http://localhost:3008");

const userId = "U2";
const roomId = "U1_U2";

socket.on("connect", () => {
  console.log(`✅ ${userId} connected with ID: ${socket.id}`);

  socket.emit("joinRoom", { roomId, userId });

  // U2 sends message after 3 seconds
  setTimeout(() => {
    socket.emit("sendMessage", {
      roomId,
      senderId: userId,
      message: "Hi U1, U2 here!",
    });
  }, 3000);
});

socket.on("receiveMessage", (data) => {
  console.log("📩 New message:", data);
});
