import dotenv from 'dotenv';
dotenv.config();

interface IConfig {
  port: number;
  env: string;
  isProduction: boolean;
  isDevelopment: boolean;
  netlifyDatabaseUrl?: string;
  netlifyDatabaseUrlUnpooled?: string;
}

const env = process.env.NODE_ENV || 'development';

const config: IConfig = {
  port: Number(process.env.PORT) || 3000,
  env,
  isProduction: env === 'production',
  isDevelopment: env === 'development',
  netlifyDatabaseUrl: process.env.NETLIFY_DATABASE_URL,
  netlifyDatabaseUrlUnpooled: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
};

console.log("config", config);

export { config, IConfig };

export default config;
