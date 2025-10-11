import { Router } from "express";
import { userRoutes } from "../users/user.routes";
import documentRoutes from "../documents/document.routes";
import lawyerRoutes from "../lawyers/lawyer.routes";
import questionRoutes from "../questions/question.routes";
const router = Router();

router.use("/users", userRoutes);
router.use("/lawyers", lawyerRoutes);
router.use("/questions", questionRoutes);
router.use("/documents", documentRoutes);

export default router;
