import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

export const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/admin/dashboard", authMiddleware(["ADMIN"]), (req, res) => {
  res.json({ message: "Welcome Admin" });
});
