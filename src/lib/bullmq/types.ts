export type QueueConfig = {
  connection: {
    host: string;
    port: number;
    password: string;
    tls: object;
  };
};
