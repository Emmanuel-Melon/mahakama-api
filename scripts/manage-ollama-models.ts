import { Ollama } from 'ollama';
import { config } from '../src/config';

async function listModels() {
  const client = new Ollama({ host: config.ollamaUrl });
  try {
    const models = await client.list();
    console.log('Available models:');
    console.log(JSON.stringify(models, null, 2));
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

async function pullModel(modelName: string) {
  const client = new Ollama({ host: config.ollamaUrl });
  try {
    console.log(`Pulling model: ${modelName}`);
    const response = await client.pull({ model: modelName, stream: false });
    console.log('Pull response:', response);
  } catch (error) {
    console.error(`Error pulling model ${modelName}:`, error);
  }
}

// Get command line arguments
const command = process.argv[2];
const modelName = process.argv[3];

if (command === 'list') {
  listModels();
} else if (command === 'pull' && modelName) {
  pullModel(modelName);
} else {
  console.log('Usage:');
  console.log('  List models: npx ts-node scripts/manage-ollama-models.ts list');
  console.log('  Pull model:  npx ts-node scripts/manage-ollama-models.ts pull <model-name>');
  console.log('\nExample:');
  console.log('  npx ts-node scripts/manage-ollama-models.ts pull nomic-embed-text');
}
