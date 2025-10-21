import dotenv from "dotenv";
dotenv.config();

interface IConfig {
  port: number;
  env: string;
  isProduction: boolean;
  isDevelopment: boolean;
  netlifyDatabaseUrl?: string;
  netlifyDatabaseUrlUnpooled?: string;
  geminiApiKey?: string;
  redisUrl?: string;
  upstashRedisRestUrl?: string;
  upstashRedisRestToken?: string;
  upstashRedisRestPassword?: string;
  redisPort?: number;
  chromaApiKey?: string;
  chromaDatabase?: string;
  chromaTenant?: string;
  ollamaUrl?: string;
}

const env = process.env.NODE_ENV || "development";

const config: IConfig = {
  port: Number(process.env.PORT) || 3000,
  env,
  isProduction: env === "production",
  isDevelopment: env === "development",
  netlifyDatabaseUrl: process.env.NETLIFY_DATABASE_URL,
  netlifyDatabaseUrlUnpooled: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  geminiApiKey: process.env.GEMINI_API_KEY,
  redisUrl: process.env.REDIS_URL,
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  upstashRedisRestPassword: process.env.UPSTASH_REDIS_REST_PASSWORD,
  redisPort: Number(process.env.REDIS_PORT),
  chromaApiKey: process.env.CHROMA_API_KEY,
  chromaDatabase: process.env.CHROMA_DATABASE,
  chromaTenant: process.env.CHROMA_TENANT,
  ollamaUrl: process.env.OLLAMA_URL || "http://127.0.0.1:11434/",
};

export { config, IConfig };

export default config;
