interface IConfig {
  port: number;
  env: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

const env = process.env.NODE_ENV || 'development';

const config: IConfig = {
  port: Number(process.env.PORT) || 3000,
  env,
  isProduction: env === 'production',
  isDevelopment: env === 'development',
};

export { config, IConfig };

export default config;
