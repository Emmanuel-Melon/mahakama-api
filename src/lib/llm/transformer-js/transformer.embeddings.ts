import { queueManager, QueueName } from "../../bullmq";
import { Queue, JobsOptions, Worker } from "bullmq";
import { config } from "../../../config";
import { stripUpstashUrl } from "../../bullmq/utils";
import { TransformerClient, EmbeddingOptions, TransformerModels } from ".";

/**
 * Cache embeddings for better performance
 * Batch process embeddings for efficiency
 */

/**
 * Generates an embedding for the given text using the specified model and options
 *
 * @param text - The input text to generate embeddings for
 * @param options - Configuration options for the embedding generation
 * @returns A promise that resolves to an array of numbers representing the embedding
 */
export const generateEmbedding = async (
  text: string,
  options: EmbeddingOptions = {},
): Promise<number[]> => {
  // Get or create the transformer client instance
  const client = TransformerClient.getInstance(options?.model, options);
  const extractor = await client.getExtractor();
  const { pooling = "mean", normalize = true } = client.getOptions();

  if (!extractor) {
    throw new Error("Failed to initialize feature extractor");
  }

  // Generate the embedding using the specified model and options
  const output = await extractor(text, {
    pooling,
    normalize,
  });

  return Array.from(output.data);
};

/**
 * Generates embeddings for multiple texts in parallel
 * This is more efficient than processing texts one by one
 *
 * @param texts - Array of input texts to generate embeddings for
 * @param options - Configuration options for the embedding generation
 * @returns A promise that resolves to an array of embeddings
 */
export const generateEmbeddings = async (
  texts: string[],
  options: EmbeddingOptions = {},
): Promise<number[][]> => {
  // Get or create the transformer client instance
  const client = TransformerClient.getInstance(options?.model, options);
  const extractor = await client.getExtractor();
  const { pooling = "mean", normalize = true } = client.getOptions();

  if (!extractor) {
    throw new Error("Failed to initialize feature extractor");
  }

  // Process all texts in parallel for better performance
  const results = await Promise.all(
    texts.map((text) =>
      extractor(text, { pooling, normalize }).then((output) =>
        Array.from(output.data),
      ),
    ),
  );

  return results;
};

/**
 * We'll turn this into a class that generates embeddings using different models
 * and techniques based on config/env in the future if needed
 */
