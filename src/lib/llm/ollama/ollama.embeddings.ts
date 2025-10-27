import { ollamaClient } from ".";
import { config } from "../../../config";

console.log(config.ollamaUrl);

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



(async () => {
  console.log('Generating embedding...')
  const embedding = await generateEmbedding("Hello, world!");
  console.log(embedding);
})();