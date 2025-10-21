import { pipeline } from "@huggingface/transformers";

export enum TransformerModels {
  ALL_MINILM_L6_V2 = "Xenova/all-MiniLM-L6-v2",
}

type PoolingType =
  | "mean"
  | "none"
  | "cls"
  | "first_token"
  | "eos"
  | "last_token";

export interface EmbeddingOptions {
  model?: TransformerModels;
  pooling?: PoolingType;
  normalize?: boolean;
}

export type FeatureExtractionResult = {
  data: Float32Array | Float64Array | Int32Array;
};

export class TransformerClient {
  private static instance: TransformerClient;
  private extractor:
    | ((text: string, options?: any) => Promise<FeatureExtractionResult>)
    | null = null;
  private model: TransformerModels;
  private options: Omit<EmbeddingOptions, "model">;

  private constructor(
    model: TransformerModels = TransformerModels.ALL_MINILM_L6_V2,
    options: Omit<EmbeddingOptions, "model"> = {},
  ) {
    this.model = model;
    this.options = {
      pooling: "mean",
      normalize: true,
      ...options,
    };
  }

  public static getInstance(
    model?: TransformerModels,
    options?: Omit<EmbeddingOptions, "model">,
  ): TransformerClient {
    if (!TransformerClient.instance) {
      TransformerClient.instance = new TransformerClient(model, options);
    }
    return TransformerClient.instance;
  }

  public async getExtractor() {
    if (!this.extractor) {
      // @ts-ignore - The pipeline type is complex, so we'll use a type assertion
      this.extractor = await pipeline("feature-extraction", this.model, {
        revision: "main",
        // local_files_only: false // Uncomment to disable local model caching
      });
    }
    return this.extractor;
  }

  public getModel(): TransformerModels {
    return this.model;
  }

  public getOptions(): Omit<EmbeddingOptions, "model"> {
    return { ...this.options };
  }
}
