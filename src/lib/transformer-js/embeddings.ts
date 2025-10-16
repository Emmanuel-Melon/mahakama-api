// cache embeddings

// batch process embeddings
import { pipeline } from "@huggingface/transformers";
export const generateEmbedding = async (text: string) => {
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
  );

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};

//text generation: Xenova/LaMini-Flan-T5-783M
