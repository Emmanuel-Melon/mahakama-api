import { generateEmbedding } from "../../lib/transformer-js/embeddings";
import { laws } from "../dataset/laws.dataset";
import { measureLawSimilarity } from "../similarity-cosines";
import { SimilarityResult } from "../types";

const RELEVANCE_THRESHOLD = 0.7;

export interface LawEmbedding {
  id: number;
  title: string;
  content: string;
  embedding: number[];
  category?: string; // Added from your dataset
  source?: string; // Added from your dataset
}

export const vectorizeLaws = async (): Promise<LawEmbedding[]> => {
  return Promise.all(
    laws.map(async (law) => ({
      id: law.id,
      title: law.title,
      content: law.content,
      category: law.category,
      source: law.source,
      embedding: await generateEmbedding(law.content, {}),
    })),
  );
};

let cachedLawEmbeddings: LawEmbedding[] | null = null;

export const getVectorizedLaws = async (): Promise<LawEmbedding[]> => {
  if (!cachedLawEmbeddings) {
    console.log("Generating law embeddings...");
    cachedLawEmbeddings = await vectorizeLaws();
  }
  return cachedLawEmbeddings;
};

export const findRelevantLaws = async (
  query: string,
): Promise<SimilarityResult[]> => {
  const queryEmbedding = await generateEmbedding(query, {});
  const lawEmbeddings = await getVectorizedLaws();
  const similarityCosines = await measureLawSimilarity(
    queryEmbedding,
    lawEmbeddings,
  );
  return similarityCosines.filter(
    (law) => law.similarityCosineScore >= RELEVANCE_THRESHOLD,
  );
};

export const getMostRelevantLaw = <T extends { similarityCosineScore: number }>(
  laws: T[],
): T | null => {
  if (!laws.length) return null;
  return laws.reduce((prev, current) =>
    prev.similarityCosineScore > current.similarityCosineScore ? prev : current,
  );
};
