import { GeminiClient } from ".";

export class GeminiEmbeddingClient extends GeminiClient {
  public async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.models.embedContent({
        model: this.EMBEDDING_MODEL_NAME,
        contents: text,
        config: {
          taskType: "RETRIEVAL_DOCUMENT",
        },
      });

      const embedding = response.embeddings?.[0]?.values;

      if (!embedding || embedding.length === 0) {
        throw new Error("Embedding generation failed or returned empty vector");
      }

      return embedding;
    } catch (error) {
      console.error("Error in GeminiEmbeddingClient.generateEmbedding:", error);
      throw error;
    }
  }
}
