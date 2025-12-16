import { Server } from "socket.io";
import http from "http";
import { verifyToken } from "./middlewares/jwt.js";
import prisma  from "./config/prisma.js";
import { RequestStatus } from "@prisma/client";




export function intheSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: ""
    }
  })

  // authencatiing
  io.use(async (socket, next)=> {
    try{
      const token = socket.handshake.auth.token;
      if(!token) return next (new Error("Unauthorized"))

      const payload = verifyToken(token)
      socket.data.user = payload;

      next();
    } catch (error){
      next(new Error ("Unauthorized"))
    }
  })

  io.on("connection", (socket) => {
    console.log('Socket connected:', socket.data.user.userId )


    // joining the chat
    socket.on("join-request", async (requestId: string) => {
      const request = await prisma.supportRequest.findUnique({
        where:{id: requestId}
      })

      if(!request){
        socket.emit("error", "Request not Found");
        return;
      }

      if (request.status !== RequestStatus.ACTIVE){
        socket.emit("error", "Chat not Active");
        return;
      }

      const userId = socket.data.userId;

    })
  })
}
