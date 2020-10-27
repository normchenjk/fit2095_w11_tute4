const path = require("path");
const express = require("express");
const app = express();
const port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/w11tute")));

let server = require("http").Server(app);
let io = require("socket.io")(server);

server.listen(port, () => {
  console.log("Listening on port " + port);
});


io.on("connection", socket => {
  console.log("Received a new connection connection from client. Its ID is " + socket.id);
  
  socket.on("joinRoom", data => {
    console.log("Received join request", data)
    socket.leaveAll(); // Leave all rooms.
    socket.join(data.room); // Join the specified room.

    sendMessageToClient(io, null, null, data.room, `${data.nickname} has joined the room: ${data.room}.`);
  });

  socket.on("newMessage", data => {
    console.log("Received new message", data);
    sendMessageToClient(io, socket.id, data.nickname, data.room, data.message);
  });
});

function sendMessageToClient(io, senderSocketId, senderNickname, targetRoom, message) {
  io.sockets.to(targetRoom).emit("message", {
    msg: message,
    sender: senderNickname,
    senderId: senderSocketId,
    timeStamp: getCurrentDate()
  });
}

function getCurrentDate() {
  let d = new Date();
  return d.toLocaleString();
}
