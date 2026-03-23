import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { upsertPreference } from "../operations/inference.insert";
import { LLMProviderRegistry } from "@/lib/llm/llm.registry";
import { InferenceStrategyRegistry } from "../inference.registry";
import type { LLMProviderName } from "@/lib/llm/llms.types";

export const upsertPreferenceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, strategyKey } = req.params;
    const { provider, model } = req.body as {
      provider: LLMProviderName;
      model?: string;
    };

    try {
      InferenceStrategyRegistry.get(strategyKey);
    } catch {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `Unknown strategy key: "${strategyKey}"`,
      );
    }

    if (!LLMProviderRegistry.has(provider)) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `Unknown provider: "${provider}". Available: ${LLMProviderRegistry.registeredNames().join(", ")}`,
      );
    }

    const preference = unwrap(
      await upsertPreference(userId, strategyKey, provider, model),
    );

    return sendSuccessResponse(
      req,
      res,
      { data: preference, type: "single" } as any,
      { status: HttpStatus.SUCCESS },
    );
  },
);
