import { ollamaClient } from ".";

export const generateEmbedding = async (query: string) => {
  const response = await ollamaClient.getClient().embed({
    model: "nomic-embed-text",
    input: query,
  });

  return {
    model: "nomic-embed-text",
    embeddings: response.embeddings,
    query,
    metadata: {},
  };
};
