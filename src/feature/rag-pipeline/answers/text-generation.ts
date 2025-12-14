import { chat } from "@/lib/llm/ollama/ollama.chat";
import type { LLMMessage } from "@/lib/llm/llms.types";
import { findRelevantLaws, getMostRelevantLaw } from "../knowledge/vectorizer";
import { generateResponsePrompt } from "../response-prompts";
import { laws as lawsDataset } from "../dataset/laws.dataset";
import { QueryEmbedding } from "../query/query.processor";

const DEFAULT_MODEL = "gemma3:1b";

export const answerLegalQuestion = async (
  query: QueryEmbedding,
  laws: any = lawsDataset,
  model: string = DEFAULT_MODEL,
) => {
  try {
    const relevantLaws = await findRelevantLaws(query);

    if (relevantLaws.length === 0) {
      return {
        answer: "I couldn't find any relevant laws to answer your question.",
        relevantLaws: [],
        sources: [],
      };
    }

    // Get the most relevant law
    const mostRelevantLaw = getMostRelevantLaw(relevantLaws);

    // Generate the response using the LLM
    const messages: LLMMessage[] = [
      {
        role: "system",
        content: generateResponsePrompt(query.query, mostRelevantLaw),
      },
      {
        role: "user",
        content: query.query,
      },
    ];

    const response = await chat(messages, model);
    const answer = response.message.content;

    // Extract sources from relevant laws
    const sources = relevantLaws.map((law) => ({
      id: law.id,
      title: law.title,
      category: law.category,
      source: law.source,
      similarityScore: law.similarityCosineScore,
    }));

    return {
      answer,
      relevantLaws: [mostRelevantLaw],
      sources,
    };
  } catch (error) {
    console.error("Error generating answer:", error);
    throw error;
  }
};
