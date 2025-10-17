import { generateEmbedding } from "../../lib/transformer-js/embeddings";
import { z } from "zod";
import { pipeline, AutoTokenizer } from "@huggingface/transformers";

const querySchema = z.object({
  query: z
    .string()
    .min(3, { message: "Query must be at least 3 characters long" })
    .max(1000, { message: "Query must be at most 1000 characters long" })
    .trim(),
});

type QueryInput = z.infer<typeof querySchema>;

export const sentimenAnalyzer = async (sentiment: string, options: any) => {
  // Allocate a pipeline for sentiment-analysis
  const pipe = await pipeline(
    "sentiment-analysis",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    {
      revision: "main",
      // This will load the model from the CDN
      model_file_name: "onnx/model_quantized.onnx",
      // Disable local model caching if needed
      // local_files_only: false
    },
  );
  const out = await pipe(sentiment);
  return out;
};

export const queryProcessor = async (input: string | QueryInput) => {
  const { query } =
    typeof input === "string"
      ? querySchema.parse({ query: input })
      : querySchema.parse(input);

  try {
    const [sentiment, queryEmbedding] = await Promise.all([
      sentimenAnalyzer(query, {}),
      generateEmbedding(query, {}),

    ]);

    return {
      queryEmbedding,
      sentiment,
      query,
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
