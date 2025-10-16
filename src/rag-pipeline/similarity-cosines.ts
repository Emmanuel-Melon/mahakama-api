interface LawEmbedding {
  id: number;
  title: string;
  content: string;
  embedding: number[];
}

interface SimilarityResult {
  id: number;
  title: string;
  content: string;
  embeddingLength: number;
  similarityCosine: number;
}

const lawEmbeddings: LawEmbedding[] = [];
let queryEmbedding: number[] = [];

export async function measureLawSimilarity(
  queryEmbedding: number[],
  lawEmbeddings: LawEmbedding[],
): Promise<SimilarityResult[]> {
  const similarityCosines = lawEmbeddings.map((law) => {
    const dotProduct = law.embedding.reduce(
      (sum, val, index) => sum + val * queryEmbedding[index],
      0,
    );
    return {
      id: law.id,
      title: law.title,
      content: law.content,
      embeddingLength: law.embedding.length,
      similarityCosine: dotProduct,
    };
  });

  return similarityCosines.sort(
    (a, b) => b.similarityCosine - a.similarityCosine,
  ); // Descending order
}
