import { pipeline } from "@huggingface/transformers";
import { LLMMessage } from "../lib/llm/llms.types";
import { generateEmbedding } from "../lib/llm/transformer-js/transformer.embeddings";
import { llmClientManager } from "../lib/llm";
import { laws } from "./dataset/laws.dataset";
import { getMessagesForLLM } from "../chats/operations/messages.list";
import { formatMessagesForProvider } from "../lib/llm/llm.utils";
import { logger } from "../lib/logger";

const llMClient = llmClientManager.getClient();
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
  try {
    logger.info("Initializing sentiment analysis pipeline...");
    const classifier = await pipeline(
      "sentiment-analysis",
      "Xenova/all-MiniLM-L6-v2",
      {
        revision: "main",
      },
    );
    logger.debug("Sentiment analysis pipeline initialized successfully");
    
    const result = await classifier("I love programming!");
    logger.info({ result }, "Sentiment analysis completed");
    return result;
  } catch (error) {
    logger.error({ error }, "Error in sentiment analysis");
    throw error;
  }
};

export const generateLawEmbeddings = async (): Promise<LawEmbedding[]> => {
  logger.info(`Generating embeddings for ${laws.length} laws...`);
  const startTime = Date.now();
  
  try {
    const embeddings = await Promise.all(
      laws.map(async (law) => {
        logger.debug(`Generating embedding for law ${law.id}: ${law.title}`);
        return {
          id: law.id,
          title: law.title,
          content: law.content,
          embedding: await generateEmbedding(law.content, {}),
        };
      }),
    );
    
    const duration = Date.now() - startTime;
    logger.info(`Successfully generated ${embeddings.length} embeddings in ${duration}ms`);
    return embeddings;
  } catch (error) {
    logger.error({ error }, "Error generating law embeddings");
    throw error;
  }
};

// Answer generation with Gemini
const answerQuestion = async (chatId: string, question: string) => {
  logger.info({ chatId, questionLength: question.length }, "Processing question");
  
  try {
    logger.debug("Retrieving chat history...");
    const messages = await getMessagesForLLM(chatId);
    logger.debug(`Retrieved ${messages.length} messages from chat history`);
    
    logger.debug("Formatting request for provider...");
    const formattedRequest = formatMessagesForProvider(
      "gemini",
      messages,
      {
        systemPrompt:
          "You are a helpful legal assistant. Provide concise answers within 300 characters.",
      },
    );
    
    logger.debug("Sending request to LLM...");
    const response = await llMClient.createChatCompletion(chatId, formattedRequest.options.systemPrompt);
    const answer = response.content.slice(0, 300);

    logger.info(
      { 
        questionLength: question.length,
        answerLength: answer.length,
        chatId,
      },
      "Successfully generated answer"
    );
    
    logger.debug({ question, answer }, "Question and answer details");
    
    return answer;
  } catch (error) {
    logger.error({ error, chatId, question }, "Error generating answer");
    throw error;
  }
};

// Execute all functions
const runAll = async () => {
  logger.info("Starting query embedding process");
  try {
    // Your existing code here
    logger.info("Query embedding process completed successfully");
  } catch (error) {
    logger.error({ error }, "Error in query embedding process");
    throw error;
  }
};

// Execute everything
runAll().catch((error) => {
  logger.fatal({ error }, "Unhandled error in query embedding");
  process.exit(1);
});
