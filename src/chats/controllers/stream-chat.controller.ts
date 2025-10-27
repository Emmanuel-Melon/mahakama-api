import { Request, Response, NextFunction } from "express";
import { chat } from "../../lib/llm/ollama/ollama.chat";
import { Message } from "../../lib/llm/types";

interface ChatRequest {
  messages: Message[];
  model?: string;
}

interface ChatResponse {
  content: string;
}

interface ChatErrorResponse {
  error: string;
  details?: string;
}

export const streamChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { messages, model }: ChatRequest = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Messages array is required and must not be empty",
        },
      });
    }

    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable buffering for Nginx
    res.flushHeaders?.();

    // Keep track of the connection
    let isConnected = true;
    req.on("close", () => {
      isConnected = false;
    });

    // Process the chat in a stream
    try {
      const response = await chat(messages, model);

      // Send the complete response as a single chunk
      if (isConnected) {
        const chatResponse: ChatResponse = {
          content: response.message.content,
        };
        res.write(`data: ${JSON.stringify(chatResponse)}\n\n`);
      }
    } catch (error) {
      console.error("Error in chat stream:", error);
      if (isConnected) {
        const chatErrorResponse: ChatErrorResponse = {
          error: "Failed to process chat",
          details: error instanceof Error ? error.message : "Unknown error",
        };
        res.write(`data: ${JSON.stringify(chatErrorResponse)}\n\n`);
      }
    }

    if (isConnected) {
      res.write("event: end\ndata: {}" + "\n\n");
      res.end();
    }
  } catch (error) {
    next(error);
  }
};
