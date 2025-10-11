import { Router } from "express";
import userRouter from "../users/user.routes";
import documentRouter from "../documents/document.routes";
import lawyerRouter from "../lawyers/lawyer.routes";
import questionRouter from "../questions/question.routes";
const router = Router();

router.use("/users", userRouter);
router.use("/lawyers", lawyerRouter);
router.use("/questions", questionRouter);
router.use("/documents", documentRouter);

export default router;
