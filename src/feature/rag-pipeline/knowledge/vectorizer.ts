import { SimilarityResult, QueryEmbedding } from "../types";
import { chromaClient } from "../../lib/chroma";

const COLLECTION_NAME = "legal_questions";
const RELEVANCE_THRESHOLD = 0.7;

// Local interface that extends SimilarityResult but allows string IDs
export interface ChromaSimilarityResult
  extends Omit<SimilarityResult, "id" | "embeddingLength"> {
  id: string; // Allow string IDs from ChromaDB
  title: string;
  content: string;
  embedding: number[];
  category?: string;
  source?: string;
  model?: string;
  metadata?: Record<string, any>;
  distance?: number;
  similarityCosineScore: number;
  embeddingLength: number;
}

// Helper function to convert Chroma result to SimilarityResult
function toSimilarityResult(
  chromaResult: ChromaSimilarityResult,
): SimilarityResult {
  return {
    ...chromaResult,
    id: parseInt(chromaResult.id, 10) || 0, // Convert string ID to number, default to 0 if invalid
    embeddingLength: chromaResult.embedding.length,
  };
}

export const getVectorizedLaws = async (
  queryEmbedding: number[],
): Promise<ChromaSimilarityResult[]> => {
  try {
    console.log("Querying ChromaDB for similar questions...");

    // Convert the query embedding to a string representation
    const queryText = queryEmbedding.join(",");

    // Query ChromaDB for similar documents
    const results = await chromaClient.query({
      collectionName: COLLECTION_NAME,
      queryTexts: queryText, // Pass the embedding string directly
      nResults: 10, // Get top 10 most similar results
    });

    if (!results?.ids?.[0]?.length) {
      console.log("No results found in ChromaDB");
      return [];
    }

    // Transform ChromaDB results to ChromaSimilarityResult format
    const lawEmbeddings: ChromaSimilarityResult[] = [];

    // Process each result
    for (let i = 0; i < results.ids[0].length; i++) {
      const id = results.ids[0][i];
      const metadata = results.metadatas?.[0]?.[i] || {};
      const document = results.documents?.[0]?.[i] || "";
      const embedding = Array.isArray(results.embeddings?.[0]?.[i])
        ? (results.embeddings[0][i] as number[])
        : [];

      // Calculate similarity score (ChromaDB returns distances, convert to similarity)
      const distance =
        typeof results.distances?.[0]?.[i] === "number"
          ? (results.distances[0][i] as number)
          : 0;

      // Convert distance to similarity score (assuming cosine distance where 0 = most similar)
      // Clamp the score between 0 and 1
      const similarityScore = Math.max(0, Math.min(1, 1 - distance));

      // Skip results below the threshold
      if (similarityScore < RELEVANCE_THRESHOLD) continue;

      lawEmbeddings.push({
        id: String(id || i),
        title: String(metadata?.title || `Document ${i + 1}`),
        content: String(document),
        embedding,
        category: metadata?.category ? String(metadata.category) : undefined,
        source: metadata?.source ? String(metadata.source) : undefined,
        model: metadata?.model ? String(metadata.model) : undefined,
        metadata,
        distance,
        similarityCosineScore: similarityScore,
        embeddingLength: embedding.length,
      });
    }

    console.log(
      `Found ${lawEmbeddings.length} relevant laws in ChromaDB (after filtering)`,
    );
    return lawEmbeddings;
  } catch (error) {
    console.error("Error querying ChromaDB:", error);
    throw error;
  }
};

export const findRelevantLaws = async (
  query: QueryEmbedding,
): Promise<SimilarityResult[]> => {
  try {
    const {
      embeddings: [queryEmbedding],
    } = query;

    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      throw new Error("Invalid query embedding");
    }

    // Get similar laws directly from ChromaDB
    const lawEmbeddings = await getVectorizedLaws(queryEmbedding);

    // Filter by relevance threshold and convert to SimilarityResult
    const relevantLaws = lawEmbeddings
      .filter((law) => law.similarityCosineScore >= RELEVANCE_THRESHOLD)
      .map(toSimilarityResult);

    console.log(`Found ${relevantLaws.length} relevant laws`);
    return relevantLaws;
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
