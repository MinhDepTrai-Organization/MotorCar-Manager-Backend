import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const JWT_CONFIG_NAME = 'jwtConfig';
export default registerAs(
  JWT_CONFIG_NAME,
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED,
    },
  }),
);
