import { pipeline } from "@huggingface/transformers";
import { Message } from "../lib/llm/types";
import { generateEmbedding } from "../lib/transformer-js/embeddings";
import { getLLMClient, LLMProviders } from "../lib/llm/client";
import { laws } from "./dataset";
import { measureLawSimilarity } from "./similarity-cosines";

const LLMClient = getLLMClient(LLMProviders.GEMINI);
const question = "What is the legal drinking age in Uganda?";

// TODO: implement dynamic threshold
const RELEVANCE_THRESHOLD = 0.70;

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
  const classifier = await pipeline("sentiment-analysis");
  const result = await classifier("I love programming!");
  console.log("Sentiment analysis:", result);
  return result;
};

const generateLawEmbeddings = async (): Promise<LawEmbedding[]> => {
  const embeddings = await Promise.all(
    laws.map(async (law) => ({
      id: law.id,
      title: law.title,
      content: law.content,
      embedding: await generateEmbedding(law.content)
    }))
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
    // Generate and store query embedding
    console.log("Generating query embedding...");
    queryEmbedding = await generateEmbedding(question);
    console.log("Query embedding vector length:", {
      length: queryEmbedding.length,
      contentLength: question.length,
      embeddingLength: queryEmbedding.length,
      prompt: question,
    });

    // Generate and store law embeddings
    console.log("Generating law embeddings...");
    const generatedLawEmbeddings = await generateLawEmbeddings();
    lawEmbeddings.push(...generatedLawEmbeddings);
    console.log(`Generated ${lawEmbeddings.length} law embeddings`);
    console.log("First law embedding metadata:", {
      id: lawEmbeddings[0]?.id,
      title: lawEmbeddings[0]?.title,
      contentLength: lawEmbeddings[0]?.content?.length,
      embeddingLength: lawEmbeddings[0]?.embedding?.length
    });

    // Run sentiment analysis
    // console.log("\nRunning sentiment analysis...");
    // await executeClassifier();

    // // Generate answer
    // console.log("\nGenerating answer...");
    // await answerQuestion(question);

    const allMeasuredLaws = await measureLawSimilarity(queryEmbedding, lawEmbeddings);
    console.log("Similar laws:", allMeasuredLaws);

    const relevantLaws = allMeasuredLaws.filter(law => law.similarityCosine >= RELEVANCE_THRESHOLD);
    console.log("Relevant laws:", relevantLaws);
  } catch (error) {
    console.error("Error in runAll:", error);
  }
};

// Execute everything
runAll().catch(console.error);
