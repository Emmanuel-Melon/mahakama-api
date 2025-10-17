import { readFileSync } from "fs";

interface QuestionEmbedding {
  question: string;
  embedding: number[];
  category?: string;
  source?: string;
}

interface EmbeddingsFile {
  metadata: {
    generatedAt: string;
    totalQuestions: number;
    successfulEmbeddings: number;
    embeddingModel: string;
  };
  embeddings: QuestionEmbedding[];
}

export const loadEmbeddingsFromJson = (
  filePath: string,
): QuestionEmbedding[] => {
  try {
    const data: EmbeddingsFile = JSON.parse(readFileSync(filePath, "utf-8"));
    return data.embeddings || [];
  } catch (error) {
    console.error("Error loading embeddings:", error);
    return [];
  }
};
