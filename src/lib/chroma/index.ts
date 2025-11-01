import { CloudClient, Collection } from "chromadb";
import { config } from "../../config";
import { OllamaEmbeddingFunction } from "@chroma-core/ollama";
import { AddDocumentsParams, QueryParams } from "./types";

export class ChromaClient {
  private static instance: ChromaClient;
  private _client: CloudClient;
  private _embedder: OllamaEmbeddingFunction;

  constructor() {
    if (
      !config.chromaApiKey ||
      !config.chromaTenant ||
      !config.chromaDatabase
    ) {
      throw new Error(
        "ChromaDB configuration is missing. Please check your environment variables.",
      );
    }

    this._client = new CloudClient({
      apiKey: config.chromaApiKey,
      tenant: config.chromaTenant,
      database: config.chromaDatabase,
    });

    this._embedder = new OllamaEmbeddingFunction({
      url: config.ollamaUrl,
      model: "nomic-embed-text",
    });
  }

  public static getInstance(): ChromaClient {
    if (!ChromaClient.instance) {
      try {
        ChromaClient.instance = new ChromaClient();
      } catch (error) {
        console.error("Failed to initialize ChromaDB client:", error);
        throw error;
      }
    }
    return ChromaClient.instance;
  }

  public get client(): CloudClient {
    return this._client;
  }

  public get embedder(): OllamaEmbeddingFunction {
    return this._embedder;
  }

  public async getOrCreateCollection(name: string) {
    try {
      const collection = await this._client.getOrCreateCollection({
        name,
        embeddingFunction: this._embedder,
      });
      console.log(`Connected to existing collection: ${name}`);
      return collection;
    } catch (error) {
      console.log(`Creating new collection: ${name}`);
    }
  }

  public async addDocuments(params: AddDocumentsParams): Promise<string[]> {
    const { collectionName, documents, ids, metadatas } = params;

    if (documents.length === 0) {
      console.warn("No documents provided to add");
      return [];
    }

    const collection = await this.getOrCreateCollection(collectionName);

    const documentIds =
      ids ||
      Array.from(
        { length: documents.length },
        (_, i) => `doc_${Date.now()}_${i}`,
      );

    await collection?.upsert({
      ids: documentIds,
      documents,
      metadatas,
    });

    console.log(
      `Added ${documents.length} documents to collection: ${collectionName}`,
    );
    return documentIds;
  }

  public async query(params: QueryParams) {
    const { collectionName, queryTexts, nResults = 15 } = params;

    const collection = await this.getOrCreateCollection(collectionName);

    return collection?.query({
      queryTexts: Array.isArray(queryTexts) ? queryTexts : [queryTexts],
      nResults,
    });
  }

  public async peekCollection(collectionName: string) {
    const collection = await this.getOrCreateCollection(collectionName);
    return collection?.peek({ limit: 10 });
  }

  public async countCollection(collectionName: string) {
    const collection = await this.getOrCreateCollection(collectionName);
    return collection?.count();
  }
}

const chromaClient = ChromaClient.getInstance();

export { chromaClient };
