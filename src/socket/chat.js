// src/socket/chat.js

function chatHandler(io,socket) {
 socket.on("joinRoom",({roomId,userId}) =>{
    socket.join(roomId)
    console.log(userId,"joined")
 })

 socket.on("sendMessage", ({ roomId, senderId, message }) => {
    const timestamp = new Date();
    

    console.log(`Message from ${senderId} to ${roomId}: ${message}`);
    
    io.to(roomId).emit("receiveMessage", {
      senderId,
      message,
      timestamp,
    });
  })};
module.exports = chatHandler;
