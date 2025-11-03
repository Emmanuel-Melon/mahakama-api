import express from "express";
import { initializeMiddlewares } from "./middleware/initializer";

const app = express();

initializeMiddlewares(app);

export { app };

export default app;
