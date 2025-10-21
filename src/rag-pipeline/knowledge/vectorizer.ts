import { queryProcessor } from "../query/processor";
import { measureLawSimilarity } from "../similarity-cosines";
import { SimilarityResult, QueryEmbedding } from "../types";
import { loadEmbeddingsFromJson } from "../../utils/load-json-data";
import { join } from "path";

const EMBEDDINGS_PATH = join(__dirname, "../scripts/question-embeddings.json");
const RELEVANCE_THRESHOLD = 0.7;

export interface LawEmbedding {
  id: number;
  title: string;
  content: string;
  embedding: number[];
  category?: string;
  source?: string;
  model?: string;
}

let cachedLawEmbeddings: LawEmbedding[] | null = null;

export const getVectorizedLaws = async (): Promise<LawEmbedding[]> => {
  if (!cachedLawEmbeddings) {
    console.log("Loading question embeddings...");
    const questionEmbeddings = loadEmbeddingsFromJson(EMBEDDINGS_PATH);

    // Transform question embeddings to match LawEmbedding format
    cachedLawEmbeddings = questionEmbeddings.map((q: any, index: number) => {
      // Handle both old and new question embedding formats
      const embedding = Array.isArray(q.embeddings)
        ? q.embeddings[0]
        : q.embedding;

      if (!embedding || !Array.isArray(embedding)) {
        console.warn(`Invalid embedding format for question ${index + 1}`);
      }

      return {
        id: index + 1,
        title: `Question: ${q.question?.substring(0, 50) || "No question"}...`,
        content: q.question || "",
        embedding: embedding || [],
        category: q.category,
        source: q.source,
        model: q.model,
      };
    });

    console.log(`Loaded ${cachedLawEmbeddings.length} question embeddings`);
  }
  return cachedLawEmbeddings;
};

// Rest of the file remains the same
export const findRelevantLaws = async (
  query: string,
): Promise<SimilarityResult[]> => {
  try {
    const {
      embeddings: [queryEmbedding],
    } = await queryProcessor(query);

    if (!queryEmbedding) {
      throw new Error("Failed to generate query embedding");
    }

    const lawEmbeddings = await getVectorizedLaws();

    // Filter out any invalid embeddings before similarity calculation
    const validLawEmbeddings = lawEmbeddings.filter(
      (law) =>
        law.embedding &&
        Array.isArray(law.embedding) &&
        law.embedding.length > 0,
    );

    if (validLawEmbeddings.length === 0) {
      console.warn("No valid law embeddings found");
      return [];
    }

    const similarityCosines = await measureLawSimilarity(
      queryEmbedding,
      validLawEmbeddings,
    );

    return similarityCosines.filter(
      (law) => law.similarityCosineScore >= RELEVANCE_THRESHOLD,
    );
  } catch (error) {
    console.error("Error in findRelevantLaws:", error);
    throw error;
  }
};

export const getMostRelevantLaw = <T extends { similarityCosineScore: number }>(
  laws: T[],
): T | null => {
  if (!laws.length) return null;
  return laws.reduce((prev, current) =>
    prev.similarityCosineScore > current.similarityCosineScore ? prev : current,
  );
};
