import cors from "cors";
import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import requestRoutes from "./modules/requests/request.route.js"
import messageRoute from "./modules/messages/messages.routes.js"
import reviewRoute from "./modules/reviews/review.routes.js"
import expertRoute from "./modules/profiles/profile.routes.js"

 const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,               
}));;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes)
app.use("/api/request", requestRoutes)
app.use("/api/message",messageRoute )
app.use("/api/review", reviewRoute)
app.use("/api/profile", expertRoute)

export default app;

