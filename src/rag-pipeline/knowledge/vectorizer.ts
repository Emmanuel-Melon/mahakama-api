// src/rag-pipeline/knowledge/vectorizer.ts
import { generateEmbedding } from "../../lib/transformer-js/embeddings";
import { laws } from "../dataset/laws.dataset";
import { measureLawSimilarity } from "../similarity-cosines";
import { SimilarityResult } from "../types";
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
}

let cachedLawEmbeddings: LawEmbedding[] | null = null;

export const getVectorizedLaws = async (): Promise<LawEmbedding[]> => {
  if (!cachedLawEmbeddings) {
    console.log("Loading question embeddings...");
    const questionEmbeddings = loadEmbeddingsFromJson(EMBEDDINGS_PATH);

    // Transform question embeddings to match LawEmbedding format
    cachedLawEmbeddings = questionEmbeddings.map((q, index) => ({
      id: index + 1,
      title: `Question: ${q.question.substring(0, 50)}...`,
      content: q.question,
      embedding: q.embedding,
      category: q.category,
      source: q.source,
    }));

    console.log(`Loaded ${cachedLawEmbeddings.length} question embeddings`);
  }
  return cachedLawEmbeddings;
};

// Rest of the file remains the same
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
