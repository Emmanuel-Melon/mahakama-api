import { JsonApiResourceConfig, JsonApiResponseConfig } from "./express.types";

export const serializeResource = <T>(
  resource: T & { id: string },
  config: JsonApiResourceConfig<T>,
) => ({
  type: config.type,
  id: resource.id,
  attributes: config.attributes(resource),
  ...(config.resourceMeta && { meta: config.resourceMeta(resource) }),
});

export function serializeJsonApi<T>(responseConfig: JsonApiResponseConfig<T>) {
  const { type, data, serializerConfig } = responseConfig;

  const serializedData =
    type === "collection"
      ? (data as (T & { id: string })[]).map((resource) =>
          serializeResource(resource, serializerConfig),
        )
      : serializeResource(data as T & { id: string }, serializerConfig);
  return serializedData;
}
