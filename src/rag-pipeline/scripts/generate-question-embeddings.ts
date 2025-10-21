import { generateEmbedding } from "../../lib/llm/ollama/ollama.embeddings";
import { testQuestions } from "../dataset/questions.dataset";
import { writeFileSync } from "fs";
import { join } from "path";

interface QuestionEmbedding {
  question: string;
  embedding: number[];
  category?: string;
  timestamp: string;
  model: string;
}

async function generateQuestionEmbeddings() {
  const embeddings: QuestionEmbedding[] = [];

  console.log(
    `\n=== Generating embeddings for ${testQuestions.length} questions ===\n`,
  );

  for (const [index, question] of testQuestions.entries()) {
    try {
      console.log(
        `Processing question ${index + 1}/${testQuestions.length}: "${question}"`,
      );

      const {
        embeddings: [embedding],
        model,
      } = await generateEmbedding(question);

      if (!embedding) {
        throw new Error(
          "Failed to generate embedding: empty response from Ollama",
        );
      }

      // Try to determine category based on question content
      let category = "General";
      if (question.toLowerCase().includes("citizen")) category = "Citizenship";
      else if (question.toLowerCase().includes("right")) category = "Rights";
      else if (question.toLowerCase().includes("land")) category = "Property";
      else if (question.toLowerCase().includes("rent")) category = "Housing";
      else if (question.toLowerCase().includes("work")) category = "Employment";

      embeddings.push({
        question,
        embedding,
        category,
        timestamp: new Date().toISOString(),
        model,
      });

      console.log(
        `✅ Generated embedding (${embedding.length} dimensions) using ${model}`,
      );

      // Add a small delay between generations to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error processing question: ${question}`);
      console.error(error);
    }
  }

  // Save embeddings to a file
  const outputPath = join(__dirname, "question-embeddings.json");
  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        metadata: {
          generatedAt: new Date().toISOString(),
          totalQuestions: testQuestions.length,
          successfulEmbeddings: embeddings.length,
          embeddingModel: embeddings[0]?.model || "nomic-embed-text",
        },
        embeddings,
      },
      null,
      2,
    ),
  );

  console.log(`\n=== Embedding Generation Complete ===`);
  console.log(`✅ Successfully generated ${embeddings.length} embeddings`);
  console.log(`📄 Saved to: ${outputPath}`);

  return embeddings;
}

// Run the script if executed directly
if (require.main === module) {
  generateQuestionEmbeddings().catch(console.error);
}

export { generateQuestionEmbeddings };
