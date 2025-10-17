import { pipeline } from "@huggingface/transformers";
import { Message } from "../lib/llm/types";
import { generateEmbedding } from "../lib/transformer-js/embeddings";
import { getLLMClient, LLMProviders } from "../lib/llm/client";
import { laws } from "./dataset/laws.dataset";

import { queryProcessor } from "./query/processor";

const LLMClient = getLLMClient(LLMProviders.GEMINI);
const question = "What is the legal drinking age in Uganda?";

// TODO: implement dynamic threshold
const RELEVANCE_THRESHOLD = 0.7;

interface LawEmbedding {
  id: number;
  title: string;
  content: string;
  embedding: number[];
}

const lawEmbeddings: LawEmbedding[] = [];
let queryEmbedding: number[] = [];

// Sentiment analysis with Hugging Face
const executeClassifier = async () => {
  const classifier = await pipeline("sentiment-analysis", "Xenova/all-MiniLM-L6-v2", {
    revision: "main",
    // This will load the model from the CDN
    model_file_name: "onnx/model_quantized.onnx",
    // Disable local model caching if needed
    // local_files_only: false
  });
  const result = await classifier("I love programming!");
  console.log("Sentiment analysis:", result);
  return result;
};

export const generateLawEmbeddings = async (): Promise<LawEmbedding[]> => {
  const embeddings = await Promise.all(
    laws.map(async (law) => ({
      id: law.id,
      title: law.title,
      content: law.content,
      embedding: await generateEmbedding(law.content, {}),
    })),
  );
  return embeddings;
};

// Answer generation with Gemini
const answerQuestion = async (question: string) => {
  try {
    const messages: Message[] = [
      {
        role: "system",
        content:
          "You are a helpful legal assistant. Provide concise answers within 300 characters.",
      },
      {
        role: "user",
        content: question,
      },
    ];

    const response = await LLMClient.createChatCompletion(messages);
    const answer = response.content.slice(0, 300);

    console.log("\n--- Question ---");
    console.log(question);
    console.log("\n--- Answer ---");
    console.log(answer);
    console.log("\nAnswer length:", answer.length, "characters");

    return answer;
  } catch (error) {
    console.error("Error generating answer:", error);
    throw error;
  }
};

// Execute all functions
const runAll = async () => {
  try {
  } catch (error) {
    console.error("Error in runAll:", error);
  }
};

// Execute everything
runAll().catch(console.error);
