import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserValidationType } from 'src/auth/strategy/jwt.strategy';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserValidationType;
  },
);
