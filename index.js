const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const path = require("path");
const express = require("express");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ port: 8080 });

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

console.log("Server running on ws://localhost:8080");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(3000, () => {
  console.log("HTTP server running on http://localhost:3000");
});