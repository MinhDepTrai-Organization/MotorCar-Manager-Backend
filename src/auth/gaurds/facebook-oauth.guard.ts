import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
  // Ghi đè lại để xử lý khi user hủy hoặc lỗi OAuth
  handleRequest(err, user, info, context) {
    if (err || !user) return null; // Không redirect ở đây
    return user;
  }
}
