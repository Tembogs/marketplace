import { Server } from "socket.io";
import http from "http";
import { verifyToken } from "./middlewares/jwt.js";
import prisma from "./config/prisma.js";
import  {MessageService}  from "./modules/messages/messages.services.js"; 

export function intheSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', 
      methods: ["GET", "POST"]
    }
  });

  // 1. Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Unauthorized"));

      const payload = verifyToken(token);
      socket.data.user = payload;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  // 2. Main Connection Handler
  io.on("connection", async (socket) => {
    const userId = socket.data.user.userId;
    console.log('✅ Socket connected:', userId);
    socket.join(`user_${userId}`);

    // Set user to Online in DB
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true }
    });

    // A. JOIN ROOM LOGIC
    socket.on("join-request", async (requestId: string) => {
      const request = await prisma.supportRequest.findUnique({
        where: { id: requestId }
      });

      if (!request) {
        return socket.emit("error", "Request not found");
      }

      // Security: Only allow the client or the assigned expert into the room
      if (request.userId !== userId && request.expertId !== userId) {
        return socket.emit("error", "Access Denied");
      }

      socket.join(requestId);
      console.log(`👤 User ${userId} joined room: ${requestId}`);
    });

    // B. SEND MESSAGE LOGIC
    socket.on("Send-message", async ({ requestId, content }) => {
      try {
        
        await MessageService.sendMessage(requestId, userId, content);
      } catch (err: any) {
        socket.emit("error", err.message);
      }
    });

    // C. DISCONNECT LOGIC
    socket.on("disconnect", async () => {
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false }
      });
      console.log("❌ Socket disconnected:", userId);
    });
  });

  return io;
}