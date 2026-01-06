import express from "express";
import { createServer } from "http";
import {intheSocket}  from "./socket";
import "dotenv/config";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io and export it if needed elsewhere
export const io = intheSocket(httpServer);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});