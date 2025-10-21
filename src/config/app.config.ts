import { registerAs } from '@nestjs/config';
export const APP_CONFIG_TOKEN = 'appConfig';

export interface AppConfig {
  BE_URL: string;
  FE_URL_ADMIN: string;
  FE_URL_USER: string;
  DEPLOY_BE_URL_NGROK: string;
  RESET_PASSWORD_SECRET: string;
}

export default registerAs(
  APP_CONFIG_TOKEN,
  (): AppConfig => ({
    BE_URL: process.env.BE_URL,
    FE_URL_ADMIN: process.env.FE_URL_ADMIN,
    FE_URL_USER: process.env.FE_URL_USER,
    DEPLOY_BE_URL_NGROK: process.env.DEPLOY_URL_NGROK,
    RESET_PASSWORD_SECRET: process.env.RESET_PASSWORD_SECRET,
  }),
);
