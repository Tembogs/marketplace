import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import adminRoutes from "./modules/admin/admin.routes";
import requestRoutes from "./modules/requests/request.route"
import messageRoute from "./modules/messages/messages.routes"

export const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes)
app.use("/api/request", requestRoutes)
app.use("/api/message",messageRoute )
// Example protected route
app.get("/api/admin/dashboard", authMiddleware(["ADMIN"]), (req, res) => {
  res.json({ message: "Welcome Admin" });
});
