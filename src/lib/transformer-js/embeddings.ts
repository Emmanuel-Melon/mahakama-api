import { queueManager, QueueName, QueueInstance } from "../bullmq";
import { Queue, JobsOptions, Worker } from "bullmq";
import { config } from "../../config";
import { stripUpstashUrl } from "../bullmq/utils";

export enum TransformerModels {
  ALL_MINILM_L6_V2 = "Xenova/all-MiniLM-L6-v2",
}

// cache embeddings
// batch process embeddings
import { pipeline } from "@huggingface/transformers";

interface EmbeddingOptions {
  model?: TransformerModels;
  pooling?: "mean" | "none" | "cls" | "first_token" | "eos" | "last_token";
  normalize?: boolean;
}

export const generateEmbedding = async (
  text: string,
  {
    model = TransformerModels.ALL_MINILM_L6_V2,
    pooling = "mean",
    normalize = true,
  }: EmbeddingOptions,
) => {
  const extractor = await pipeline("feature-extraction", model);

  const output = await extractor(text, {
    pooling,
    normalize,
  });

  return Array.from(output.data);
};
