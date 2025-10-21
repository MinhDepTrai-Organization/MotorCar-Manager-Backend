import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public-route';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }
    return true;
  }

  //Phương thức handleRequest trong JwtAuthGuard sẽ xử lý kết quả xác thực từ Passport
  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const requestMethod = request.method;
    const requestPath = request.route?.path;
    const permissions = user.permissions ?? [];
    // check permissions : bên validate sẽ trả về user có role - permission
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid access token');
    }
    return user;
  }
}
