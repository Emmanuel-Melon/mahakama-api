import { z } from "zod";
import { generateEmbedding } from "@/lib/llm/ollama";

export interface QueryEmbedding {
  model: string;
  embeddings: number[][];
  query: string;
  metadata: Record<string, unknown>;
}

const querySchema = z.object({
  query: z
    .string()
    .min(3, { message: "Query must be at least 3 characters long" })
    .max(1000, { message: "Query must be at most 1000 characters long" })
    .trim(),
});

type QueryInput = z.infer<typeof querySchema>;

export const queryProcessor = async (
  input: string | QueryInput,
): Promise<QueryEmbedding> => {
  const { query } =
    typeof input === "string"
      ? querySchema.parse({ query: input })
      : querySchema.parse(input);

  try {
    const queryEmbedding = await generateEmbedding(query);

    return {
      model: queryEmbedding.model,
      embeddings: queryEmbedding.embeddings,
      query,
      metadata: {},
    };
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error; // Re-throw to allow caller to handle the error
  }
};

// thresholding
// vectorizing
// optimization

//    // Step 2: Construct intelligent prompt
//   const prompt = constructPrompt(question, relevantLaws);

// thinking process
