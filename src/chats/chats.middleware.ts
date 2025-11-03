import { Request, Response, NextFunction } from "express";
import {
  createChatSessionSchema,
  sendMessageSchema,
  type ChatSessionAttrs,
  type SendMessageAttrs,
} from "./chats.schema";

export const validateCreateChatSession = (
  req: Request<{}, {}, ChatSessionAttrs>,
  res: Response,
  next: NextFunction,
) => {
  const result = createChatSessionSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.format();
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid input data",
      details: formattedErrors,
    });
  }
  req.validatedData = result.data;
  next();
};

export const validateSendMessage = (
  req: Request<{}, {}, SendMessageAttrs>,
  res: Response,
  next: NextFunction,
) => {
  const result = sendMessageSchema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.format();
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid input data",
      details: formattedErrors,
    });
  }
  req.validatedData = result.data;
  next();
};

// turn into route level middleware
// const metadata: ControllerMetadata = {
//   name: "createChatController",
//   resourceType: "chat",
//   route: req.path,
//   operation: "create",
//   requestId: req.requestId,
// };
