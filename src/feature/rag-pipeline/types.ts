export interface LawEmbedding {
  id: number;
  title: string;
  content: string;
  embedding: number[];
}

export interface QueryEmbedding {
  model: string;
  embeddings: number[][];
  query: string;
  metadata: Record<string, unknown>;
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
