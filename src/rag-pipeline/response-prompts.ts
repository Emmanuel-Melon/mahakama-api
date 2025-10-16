export const generateResponsePrompt = (
  question: string,
  mostRelevantLaw: any,
) => {
  const prompt = `You are a legal assistant. You MUST respond in the exact format specified below.

LAW TO CITE (MUST BE USED VERBATIM):
"${mostRelevantLaw.content}"

Question: ${question}

REQUIRED RESPONSE FORMAT:

Answer: [Your direct response to the question]

Relevant Law: [EXACT text from the law above, including all punctuation and formatting]

RULES:
1. The "Answer" section should be a clear, concise response to the question
2. The "Relevant Law" section MUST be the EXACT text from the law above
3. Do NOT modify the law text in any way
4. Do NOT add any commentary or additional text after the Relevant Law

Example:
Answer: The legal drinking age in Uganda is 18 years old.

Relevant Law: The legal drinking age in Uganda is 18 years old. Anyone below this age is prohibited from purchasing or consuming alcoholic beverages in public places.

Now provide your response in the required format:
`;
  return prompt;
};
