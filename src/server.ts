import "dotenv/config";
import app from "./app";
import { createServer } from "http";
import {intheSocket}  from "./socket";


const httpServer = createServer(app);

// Initialize Socket.io and export it if needed elsewhere
export const io = intheSocket(httpServer);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});