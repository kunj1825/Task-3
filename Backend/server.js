const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const Document = require("./models/Document");  // ✅ import schema

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

mongoose.connect("mongodb://localhost:27017/realtimeDocs")
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("get-document", async (docId) => {
    let document = await Document.findById(docId);
    if (!document) {
      document = await Document.create({ _id: docId, content: "" });
    }
    socket.join(docId);
    socket.emit("load-document", document.content);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(docId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(docId, { content: data });
    });
  });
});

server.listen(3001, () => console.log("🚀 Server running on port 3001"));
