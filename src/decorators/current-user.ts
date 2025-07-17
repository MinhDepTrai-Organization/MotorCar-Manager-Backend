import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserValidationType } from 'src/auth/passport/jwt.strategy';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserValidationType;
  },
);
