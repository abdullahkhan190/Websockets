const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const path = require("path");
const express = require("express");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("A client connected!");

  socket.send("Welcome to my WebSocket server!");

  socket.on("message", (data) => {
    const message = data.toString();
    console.log("Received:", message);

    // Broadcast to all connected clients
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  socket.on("close", () => {
    console.log("A client disconnected!");
  });

  socket.on("error", console.error);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`HTTP and WebSocket server running on port ${port}`);
});