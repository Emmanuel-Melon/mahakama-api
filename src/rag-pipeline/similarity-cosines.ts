import { LawEmbedding, SimilarityResult } from "./types";

export async function measureLawSimilarity(
  queryEmbedding: number[],
  lawEmbeddings: LawEmbedding[],
): Promise<SimilarityResult[]> {
  const similarityCosineScores = lawEmbeddings.map((law) => {
    const dotProduct = law.embedding.reduce(
      (sum, val, index) => sum + val * queryEmbedding[index],
      0,
    );
    return {
      id: law.id,
      title: law.title,
      content: law.content,
      embeddingLength: law.embedding.length,
      similarityCosineScore: dotProduct,
    };
  });

  return similarityCosineScores.sort(
    (a, b) => b.similarityCosineScore - a.similarityCosineScore,
  );
}
