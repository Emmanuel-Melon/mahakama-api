import { answerLegalQuestion } from "./answers/text-generation";
import { testQuestions } from "./dataset/questions.dataset";
import { writeFileSync } from "fs";
import { join } from "path";

interface TestResult {
  question: string;
  answer: string;
  sources: Array<{
    id: number;
    title: string;
    category?: string;
    source?: string;
    similarityScore: number;
  }>;
  timestamp: string;
  processingTimeMs: number;
}

async function runQATests() {
  const results: TestResult[] = [];

  // Select a subset of questions for testing (first 5 from each category)
  const selectedQuestions = [
    ...testQuestions.slice(0, 3), // Citizenship
    ...testQuestions.slice(7, 10), // Human rights
    ...testQuestions.slice(15, 18), // Family/Marriage
    ...testQuestions.slice(21, 25), // Housing
    ...testQuestions.slice(30, 33), // Land/Property
  ];

  console.log(
    `\n=== Starting QA Test with ${selectedQuestions.length} questions ===\n`,
  );

  for (const question of selectedQuestions) {
    try {
      console.log(`\nProcessing: "${question}"`);

      const startTime = Date.now();
      const { answer, sources } = await answerLegalQuestion(question);
      const processingTimeMs = Date.now() - startTime;

      const result: TestResult = {
        question,
        answer,
        sources: sources.map((s) => ({
          id: s.id,
          title: s.title,
          category: s.category,
          source: s.source,
          similarityScore: s.similarityScore,
        })),
        timestamp: new Date().toISOString(),
        processingTimeMs,
      };

      results.push(result);

      // Log progress
      console.log(`✅ Completed in ${processingTimeMs}ms`);
      console.log(`   Answer: ${answer.substring(0, 60)}...`);
      console.log(`   Sources: ${sources.length} sources found`);
    } catch (error) {
      console.error(`❌ Error processing question: ${question}`);
      console.error(error);
    }

    // Add a small delay between questions to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Save results to a file
  const outputPath = join(__dirname, "test-results.json");
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n=== Test Complete ===`);
  console.log(`Results saved to: ${outputPath}`);

  return results;
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runQATests().catch(console.error);
}

export { runQATests };
