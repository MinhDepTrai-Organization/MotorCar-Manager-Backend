import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    private configService: ConfigService,

    @Inject(refreshJwtConfig.KEY)
    private refreshJWTConfig: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJWTConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { email: payload.email, role: payload.role };
  }
}

// 1. Tổng quan
// Mục đích:

// Dùng để xác thực các yêu cầu có chứa Refresh Token trong header.
// Refresh Token sẽ được giải mã để kiểm tra tính hợp lệ và trích xuất thông tin cần thiết từ payload.
// Tên chiến lược (strategy name): 'refresh-jwt'.

// Điều này giúp phân biệt với các chiến lược khác (ví dụ: Access Token, Local).

//'refresh-jwt': Tên của chiến lược, cần thiết khi sử dụng trong Guard (ví dụ: @UseGuards(AuthGuard('refresh-jwt'))).

// Hàm super:

// Gọi constructor của lớp cha để thiết lập cấu hình.

// jwtFromRequest:

// Chỉ định cách trích xuất JWT từ request.
// ExtractJwt.fromAuthHeaderAsBearerToken(): Lấy JWT từ header Authorization: Bearer <token>.
// secretOrKey:

// Bí mật dùng để giải mã JWT.
// Được lấy từ biến môi trường thông qua ConfigService.

//2.3. Hàm validate
// Mục đích:

// Xác thực và xử lý payload của JWT sau khi được giải mã.
// Nếu trả về giá trị, thông tin này sẽ được đính kèm vào request dưới dạng req.user.
// Input:

// payload: Là dữ liệu chứa trong JWT (thường bao gồm thông tin như sub, email, hoặc walletAddress).
// Logic:

// Ở đây, chỉ lấy thông tin walletAddress từ payload và trả về.
// Kết quả:

// Dữ liệu trả về từ hàm validate sẽ được gắn vào request object (ví dụ: req.user.walletAddress).
