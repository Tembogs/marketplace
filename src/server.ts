import "dotenv/config";
import { app } from "./app";
import http from "http";
import { intheSocket } from "./socket";
 


const server = http.createServer(app);
intheSocket(server)
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
