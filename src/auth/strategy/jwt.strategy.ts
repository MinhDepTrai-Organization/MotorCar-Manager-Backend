import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { RoleEnum } from 'src/constants/role.enum';
import { CustomersService } from 'src/modules/customers/customers.service';
import jwtConfig from 'src/config/jwt.config';
export type PayloadType = {
  username: string;
  email: string;
  id: string;
  role: RoleEnum;
  iat: number;
  exp: number;
};
export type UserValidationType = {
  username: string;
  email: string;
  id: string;
  phone?: string;
  role: RoleEnum;
  permissions: {
    id: string;
    name: string;
    path: string;
    method: string;
    module: string;
  }[];
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private userService: UserService,
    private CustomerService: CustomersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  //Nếu token hợp lệ, nó sẽ gọi hàm validate
  async validate(payload: PayloadType) {
    // xử lí customer
    if (payload.role == RoleEnum.USER) {
      const data = await this.CustomerService.getCustomerById(payload.id);
      const { role } = data;
      return {
        username: payload.username,
        email: payload.email,
        id: payload.id,
        role: role?.name,
        permissions: role?.permissions ?? [],
        ...(data.phoneNumber ? { phone: data.phoneNumber } : {}),
      } as UserValidationType;
    }
    // xử lí admin
    const data = await this.userService.getFindById(payload.id);
    const { roles } = data;
    return {
      username: payload.username,
      email: payload.email,
      id: payload.id,
      role: roles[0]?.name,
      permissions: roles[0]?.permissions ?? [],
      ...(data.phoneNumber ? { phone: data.phoneNumber } : {}),
    } as UserValidationType;
  }
}
