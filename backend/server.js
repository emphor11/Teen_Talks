const express = require("express");
const http = require("http");
const cors = require("cors")
const { Server } = require("socket.io");
const homeRoutes =require("./routes/home")
const userRoutes = require("./routes/userRoutes")
const postRoutes =  require("./routes/postRoutes")
const followRoutes = require("./routes/followRoutes")
const chatRoutes = require("./routes/chatRoutes");
const path = require("path")
const app = express();
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true // allow cookies/auth headers
}));

app.use("/api/v1",homeRoutes)
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/follow",followRoutes)
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/chat", chatRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // change this in production
});



// Authenticate WebSocket connections
io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Auth error"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: decoded.id };
      next();
    } catch (err) {
      next(new Error("Auth error"));
    }
  });
  
  // Real-time Chat Events
  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(`✅ User connected: ${userId}`);
    socket.join(`user_${userId}`);
  
    // Notify others that user came online
    socket.broadcast.emit("user_online", { userId });
  
    // Handle message sending
    socket.on("chat_message", async ({ receiverId, content }) => {
      if (!receiverId || !content) return;
  
      try {
        const chatModel = require("./models/Chat");
        const conv = await chatModel.findOrCreateConversation(userId, receiverId);
        const message = await chatModel.sendMessage(conv.id, userId, content);
  
        const payload = {
          id: message.id,
          conversation_id: message.conversation_id,
          sender_id: message.sender_id,
          content: message.content,
          created_at: message.created_at,
        };
  
        // Emit to sender and receiver
        socket.emit("message_sent", payload);
        io.to(`user_${receiverId}`).emit("new_message", payload);
      } catch (err) {
        console.error("💥 Chat error:", err);
        socket.emit("error_message", { message: "Message send failed" });
      }
    });
  
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${userId}`);
      socket.broadcast.emit("user_offline", { userId });
    });
  });

app.listen(3000,()=>{
    console.log("server started")
})