export interface LawEmbedding {
  id: number;
  title: string;
  content: string;
  embedding: number[];
}

export interface SimilarityResult {
  id: number;
  title: string;
  content: string;
  embeddingLength: number;
  similarityCosineScore: number;
  category?: string;
  source?: string;
}
