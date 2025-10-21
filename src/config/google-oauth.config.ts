import { registerAs } from '@nestjs/config';

export const GOOGLE_OAUTH_CONFIG_NAME = 'googleAuthConfig';

export default registerAs(GOOGLE_OAUTH_CONFIG_NAME, () => ({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
}));
