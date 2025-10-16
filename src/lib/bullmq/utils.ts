export const stripUpstashUrl = (
  url: string,
): { host: string; port: number } => {
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname;
  const port = parseInt(parsedUrl.port) || 6379;
  return { host, port };
};
