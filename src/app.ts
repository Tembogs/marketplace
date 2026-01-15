import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import requestRoutes from "./modules/requests/request.route"
import messageRoute from "./modules/messages/messages.routes"
import reviewRoute from "./modules/reviews/review.routes"
import expertRoute from "./modules/profiles/profile.routes"

 const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes)
app.use("/api/request", requestRoutes)
app.use("/api/message",messageRoute )
app.use("/api/review", reviewRoute)
app.use("/api/expert", expertRoute)

export default app;

