import { Router } from "express";
import { getQuestion } from "./controllers/getQuestion.controller";
import { getQuestions } from "./controllers/getQuestions.controller";
import { createQuestionHandler } from "./controllers/createQuestion.controller";
import { processQuestionById } from "./controllers/processQuestionById.controller";

const questionRoutes = Router();

// Create a new question
questionRoutes.post("/", createQuestionHandler);

// Get all questions
questionRoutes.get("/", getQuestions);

// Get a specific question
questionRoutes.get("/:id", getQuestion);

// Process a specific question
questionRoutes.post("/:id/process", processQuestionById);

export default questionRoutes;
