
import { Router } from "express";
import { RequestController } from "./request.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";


const router = Router();

router.post("/", authMiddleware(["USER"]), RequestController.create);

router.post("/:id/transition", authMiddleware(["USER", "EXPERT"]), RequestController.transition);

export default router;
