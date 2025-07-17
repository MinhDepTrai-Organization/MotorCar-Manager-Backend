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

    //const requiresAuth = request.query?.fav === 'true';

    // if (isPublic && !requiresAuth) {
    //   return true;
    // }
    if (isPublic) {
      return true;
    }
    //JwtAuthGuard sẽ kích hoạt thông qua canActivate.
    // Active to get the req.user for role checking
    // super.canActivate(context) gọi PassportStrategy để xác thực token và gắn thông tin người dùng vào request.user.
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    // const { user } = request;
    // // const blockInfo = await this.blockUserService.findBlockUser(
    // //   user.walletAddress,
    // // );

    // // if (blockInfo) {
    // //   throw new ForbiddenException({
    // //     error: 'This address has been banned',
    // //     blockInfo,
    // //   });
    // // }

    // const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    // if (
    //   requiredRoles &&
    //   !requiredRoles.some((role) => user?.role?.includes(role))
    // ) {
    //   throw new ForbiddenException('You do not have the permission');
    // }

    return true;
  }

  //Phương thức handleRequest trong JwtAuthGuard sẽ xử lý kết quả xác thực từ Passport
  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const requestMethod = request.method;
    const requestPath = request.route?.path;
    const permissions = user.permissions ?? [];
    // const IsExist = permissions.find((permission) => {
    //   return (
    //     permission.path === requestPath && permission.method === requestMethod
    //   );
    // });

    // if (!IsExist) {
    //   throw new ForbiddenException('Bạn không có quyền truy cập endpoin này ');
    // }
    // check permissions : bên validate sẽ trả về user có role - permission
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid access token');
    }
    return user;
  }
}

// lient.handshake.auth.token: Lấy token từ auth bên phía client.
// client.handshake.headers.authorization: Lấy token từ header (nếu truyền dạng Bearer token).
