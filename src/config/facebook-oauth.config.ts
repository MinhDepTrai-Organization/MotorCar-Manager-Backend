import { registerAs } from '@nestjs/config';

export default registerAs('facebookOAuthConfig', () => ({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CLIENT_CALLBACK_URL,
}));
