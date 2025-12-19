import { app } from "./app.js";
import http from "http";
import { intheSocket } from "./socket.js";


const server = http.createServer(app);
intheSocket(server)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
