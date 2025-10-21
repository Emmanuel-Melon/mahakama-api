import { chat } from "../../lib/llm/ollama/ollama.chat";
import type { Message } from "@/lib/llm/types";
import { findRelevantLaws, getMostRelevantLaw } from "../knowledge/vectorizer";
import { generateResponsePrompt } from "../response-prompts";
import { laws as lawsDataset } from "../dataset/laws.dataset";

const DEFAULT_MODEL = "gemma3:1b";

export const answerLegalQuestion = async (
  question: string,
  laws: any = lawsDataset,
  model: string = DEFAULT_MODEL,
) => {
  try {
    const relevantLaws = await findRelevantLaws(question);

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
    const messages: Message[] = [
      {
        role: "system",
        content: generateResponsePrompt(question, mostRelevantLaw),
      },
      {
        role: "user",
        content: question,
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
