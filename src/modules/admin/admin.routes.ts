import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router()

router.get("/requests", authMiddleware(["ADMIN"]), AdminController.listRequests);
router.post("/requets/:id/close", authMiddleware(['ADMIN']), AdminController.closeRequests);
router.get("/experts/stats", authMiddleware(["ADMIN"]),AdminController.expertStats)

export default router;