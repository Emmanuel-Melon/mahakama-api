import { Request, Response, NextFunction } from "express";
import { userResponseSchema } from "../users.schema";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../lib/express/express.response";
import { HttpStatus } from "../../lib/express/http-status";
import { llmClientManager } from "../../lib/llm";
import { z } from "zod";
import { userWithProfileSchema } from "../profile.schema";
import { logger } from "../../lib/logger";
import { zodToJsonSchema } from "zod-to-json-schema";

const jsonSchema = zodToJsonSchema(userWithProfileSchema, {
  name: "PolymathProfile",
  $refStrategy: "none",
});

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // The user object is attached to the request by the authenticateToken middleware
    const user = req.user;

    if (!user) {
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZED, {
        message: "User not authenticated",
      });
    }
    // logger.info({llmClientManager}, "llmClientManager");
    const llmClient = llmClientManager.getClient();
    logger.info("my client is here~~~~");
    logger.info({ llmClient }, "clientsss");
    const response = await llmClient.createChatCompletion(
      "b6b8c3b5-9661-412a-826e-18dcb336a044",
      `Generate a short, professional profile for a user with email ${user.email}. Always respond with valid JSON only. Do NOT wrap your response in markdown code blocks or any other formatting. Return raw JSON. ${JSON.stringify(jsonSchema, null, 2)}`,
    );

    console.log("****************");
    logger.info({ response }, "response");
    console.log("****************");

    return sendSuccessResponse(
      res,
      { data: response },
      {
        status: HttpStatus.SUCCESS,
        requestId: req.requestId,
      },
    );
  } catch (error) {
    console.log("big error", error);
    next(error);
  }
};
