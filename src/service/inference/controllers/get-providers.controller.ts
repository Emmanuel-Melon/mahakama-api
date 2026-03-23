import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { LLMProviderRegistry } from "@/lib/llm/llm.registry";

export const getProvidersController = asyncHandler(
  async (_req: Request, res: Response) => {
    const providers = LLMProviderRegistry.registeredNames().map((name) => {
      const provider = LLMProviderRegistry.get(name);
      return { name: provider.name, defaultModel: provider.defaultModel };
    });

    return sendSuccessResponse(
      _req,
      res,
      { data: providers, type: "collection" } as any,
      { status: HttpStatus.SUCCESS },
    );
  },
);
