import { Router } from "express";
import { userRoutes } from "../users/user.routes";
import { lawyerRoutes } from "../lawyers/lawyer.routes";
import { questionRoutes } from "../questions/question.routes";
import documentRoutes from "../documents/document.routes";

const router = Router();

// API routes
router.use("/users", userRoutes);
router.use("/lawyers", lawyerRoutes);
router.use("/questions", questionRoutes);
router.use("/documents", documentRoutes);

export default router;
