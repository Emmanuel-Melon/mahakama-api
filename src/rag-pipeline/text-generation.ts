import { pipeline } from "@huggingface/transformers";

export const generateText = async (prompt: string) => {
  const generator = await pipeline(
    "text2text-generation",
    "Xenova/LaMini-Flan-T5-783M",
  );

  const result = await generator(prompt, {
    max_new_tokens: 100,
  });

  console.log("result", result[0]);

  return result;
};

const question = "What is the legal drinking age in Uganda?";
const law =
  "The legal drinking age in Uganda is 21 years old. Anyone below this age is prohibited from purchasing or consuming alcoholic beverages in public places.";

(async () => {
  const prompt = `You are a legal assistant. Analyze the following law and question carefully.

    Law: ${law}

    Question: ${question}

    Thought Process:
    1. Identify the key elements in the law
    2. Understand what the question is asking
    3. Determine how the law applies to the question
    4. Formulate a clear, accurate answer based on the law

    Answer:
    `;
  const result = await generateText(prompt);
  console.log(result[0]);
})();
