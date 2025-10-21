import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import {
  ActiveAcount,
  ChangeAcount,
  getAccountDto,
  LoginDto,
  UserInfo,
} from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { CustomersService } from 'src/modules/customers/customers.service';
import { RoleEnum } from 'src/constants/role.enum';
import { Role } from 'src/modules/role/entities/role.entity';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import {
  BaseProfile,
  BaseUser,
  ForgotPassword,
  LoginConfig,
  UserResponse,
  ValidateConfig,
  VerifyResetPassword,
} from './types/auth-validate.type';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { generateUUIDV4 } from 'src/helpers/utils';
import { CustomMailService } from 'src/modules/mail/mail.service';
import { APP_CONFIG_TOKEN, AppConfig } from 'src/config/app.config';
import {
  generateResetToken,
  hashPasswordFunc,
} from 'src/helpers/login-security.utils';
import { ResetPassword } from './types/auth-validate.type';
import { ResponseFunc } from './types/api-response.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private CustomersService: CustomersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    // private readonly mailerService: MailerService,
    private readonly mailerService: CustomMailService,

    @Inject(refreshJwtConfig.KEY)
    private refreshJwtTokenConfig: ConfigType<typeof refreshJwtConfig>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Customer)
    private CustomerRepository: Repository<Customer>,

    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
  ) {}

  private isAdmin = (user: BaseUser): user is User => {
    return Array.isArray(user.Roles);
  };

  private isCustomer = (user: BaseUser): user is Customer => {
    return !Array.isArray(user.Roles) && !!user.Roles;
  };

  private generateTokenAndResponse = async (
    user: BaseUser,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    user: UserResponse;
  }> => {
    let roleName: RoleEnum;
    let permissions: Permission[];
    const isCustomer = this.isCustomer(user);
    const isAdmin = this.isAdmin(user);
    if (isAdmin) {
      roleName = user.Roles[0].name;
      permissions = user.Roles[0].permissions;
    } else if (isCustomer) {
      roleName = user.Roles.name;
      permissions = user.Roles.permissions;
    } else {
      throw new Error('Role không hợp lệ');
    }

    const accessPayload = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: roleName,
    };

    const refreshPayload = {
      id: user.id,
      email: user.email,
      role: roleName,
      username: user.username,
    };

    const userResponse: UserResponse = {
      userId: user.id,
      username: user.username,
      email: user.email,
      Roles: roleName,
      avatarUrl: user.avatarUrl,
      age: user.age,
      gender: user.gender,
      permissions: permissions,
      isActice: user.isActice,
    };

    if (isAdmin) {
      userResponse.address = user.address;
    } else {
      userResponse.birthday = user.birthday;
      userResponse.phoneNumber = user.phoneNumber;
    }

    const access_token = this.jwtService.sign(accessPayload);
    const refresh_token = this.jwtService.sign(
      refreshPayload,
      this.refreshJwtTokenConfig,
    );

    return { access_token, refresh_token, user: userResponse };
  };

  // Hàm trung gian: Xử lý xác thực (Google, Facebook, getAccountAdmin)
  private handleValidation = async <T extends BaseProfile>(
    profile: T,
    config: ValidateConfig = {
      createIfNotExists: false,
      isGenerateToken: false,
    },
  ): Promise<
    | {
        access_token: string;
        refresh_token: string;
        user: UserResponse;
      }
    | User
    | Customer
  > => {
    const { email, firstName, lastName, picture } = profile;
    let user: User | Customer;

    // Kiểm tra người dùng
    if (config.isAdmin) {
      user = await this.userService.getUser1(email);
    } else {
      user = await this.CustomersService.getCustomerByEmail(email);
    }

    // Tạo người dùng mới nếu cần (cho Google/Facebook)
    if (!user && config.createIfNotExists) {
      await this.CustomerRepository.manager.transaction(async (manager) => {
        const codeId = generateUUIDV4();
        // const role_user = await this.RoleRepository.findOne({
        //   where: { name: RoleEnum.USER },
        // });
        // user = this.CustomerRepository.create({
        //   email,
        //   username: firstName && lastName ? `${lastName} ${firstName}` : email,
        //   Roles: role_user,
        //   avatarUrl: config.includeAvatar ? picture : undefined,
        //   codeId: codeId.slice(0, 4),
        //   codeExprided: dayjs().add(5, 'minutes').toDate(),
        //   isActice: true,
        // });
        // await this.CustomerRepository.save(user);
        const role_user = await manager.findOne(Role, {
          where: { name: RoleEnum.USER },
        });
        user = manager.create(Customer, {
          email,
          username: firstName && lastName ? `${lastName} ${firstName}` : email,
          Roles: role_user,
          avatarUrl: config.includeAvatar ? picture : undefined,
          codeId: codeId.slice(0, 4),
          codeExprided: dayjs().add(5, 'minutes').toDate(),
          isActice: true,
        });
        await manager.save<Customer>(user);
      });
    }

    if (!user) {
      throw new UnauthorizedException('Email không chính xác');
    }

    if (!user.isActice) {
      throw new UnauthorizedException('Tài khoản chưa được kích hoạt');
    }

    // Sinh token và response
    if (config.isGenerateToken)
      return await this.generateTokenAndResponse(user);
    else return user;
  };

  // Hàm trung gian: Xử lý đăng nhập (login, loginAdmin)
  async handleLogin(
    userInfo: LoginDto,
    config: LoginConfig = {},
  ): Promise<{
    access_token: string;
    refresh_token: string;
    user: UserResponse;
  }> {
    const { email, password } = userInfo;
    let user: User | Customer;

    // Kiểm tra người dùng
    if (config.isAdmin) {
      user = await this.userService.getUser1(email);
    } else {
      user = await this.CustomersService.getCustomerByEmail(email);
    }

    const isLoginSuccess: boolean =
      !!user && compareSync(password, user.password);
    if (!isLoginSuccess)
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');

    // Kiểm tra trạng thái kích hoạt
    if (!user.isActice) {
      throw new UnauthorizedException('Tài khoản chưa được kích hoạt');
      // if (config.isAdmin) {
      //   // throw new HttpException(
      //   //   {
      //   //     statusCode: HttpStatus.UNAUTHORIZED,
      //   //     message:
      //   //       'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản',
      //   //     code: 1,
      //   //   },
      //   //   HttpStatus.UNAUTHORIZED,
      //   // );
      // } else {
      //   // throw new NotFoundException({
      //   //   status: 404,
      //   //   message:
      //   //     'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản nha',
      //   //   data: { code: 2 },
      //   // });
      //   // throw new UnauthorizedException(
      //   //   'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản',
      //   // );
      // }
    }

    // Sinh token và response
    return await this.generateTokenAndResponse(user);
  }

  // login customer
  async login(userInfo: LoginDto) {
    // try {
    //   const { email, password } = userInfo;
    //   // có trả về permission và role
    //   const user = await this.CustomersService.getCustomerByEmail(email);

    //   if (!user) {
    //     throw new NotFoundException('Email không chính xác');
    //   }
    //   const check = compareSync(password, user.password); // true
    //   if (!check) {
    //     throw new NotFoundException('Mật khẩu không chính xác');
    //   }
    //   if (!user.isActice) {
    //     throw new NotFoundException({
    //       status: 404,
    //       message:
    //         'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản nha',
    //       data: { code: 2 },
    //     });
    //   }

    //   const accessPayload = {
    //     username: user.username,
    //     email: user.email,
    //     id: user.id,
    //     role: user.Roles.name,
    //   };

    //   const refreshPayload = {
    //     id: user.id,
    //     email: user.email,
    //     role: user.Roles.name,
    //     username: user.username,
    //   };
    //   return {
    //     access_token: this.jwtService.sign(accessPayload),
    //     refresh_token: this.jwtService.sign(
    //       refreshPayload,
    //       this.refreshJwtTokenConfig,
    //     ),
    //     userId: user.id,
    //     username: user.username,
    //     email: user.email,
    //     Roles: user.Roles.name,
    //     avatarUrl: user.avatarUrl,
    //     age: user.age,
    //     birthday: user.birthday,
    //     phoneNumber: user.phoneNumber,
    //     gender: user.gender,
    //     permissions: user.Roles.permissions,
    //   };
    // } catch (error) {
    //   throw error;
    // }

    try {
      return await this.handleLogin(userInfo, {
        isAdmin: false,
      });
    } catch (error) {
      console.error('user đăng nhập bị lỗi: ', error);
      throw error;
    }
  }
  // admin
  async loginAdmin(userInfo: LoginDto) {
    try {
      return await this.handleLogin(userInfo, { isAdmin: true });
    } catch (error) {
      console.error('Có lỗi xảy ra với admin đăng nhập: ', error);
      throw error;
    }
  }
  // getAccount for Role Admin
  async getAccountAdmin(userInfo: getAccountDto) {
    const { email } = userInfo;
    // lấy ra role , permission  nữa nhen
    const user = await this.userService.getUser1(email);

    if (!user) {
      throw new UnauthorizedException('Email không chính xác');
    }
    const accessPayload = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.Roles[0].name,
    };

    const refreshPayload = {
      id: user.id,
      email: user.email,
      role: user.Roles[0].name,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED'),
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
      userId: user.id,
      username: user.username,
      email: user.email,
      Roles: user.Roles[0].name,
      avatarUrl: user.avatarUrl,
      age: user.age,
      address: user.address,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      permissions: user.Roles[0].permissions,
    };
  }

  async refreshAccessToken(req: any) {
    try {
      const { email } = req;
      // Khai báo biến user ngoài if-else để tránh việc biến user bị hư mất
      let user;
      // return req;
      if (req.role == 'user') {
        user = await this.CustomersService.getCustomerByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');
        const accessPayload = {
          username: user.username,
          email: user.email,
          id: user.id,
          role: user.Roles.name,
        };
        return {
          access_token: this.jwtService.sign(accessPayload),
        };
      } else {
        // lấy ra role
        user = await this.userService.getUser1(email);
        if (!user) throw new UnauthorizedException('User not found');
        const accessPayload = {
          username: user.username,
          email: user.email,
          id: user.id,
          role: user.Roles[0].name,
        };
        return {
          access_token: this.jwtService.sign(accessPayload),
        };
      }
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token has expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new UnauthorizedException('An unexpected error occurred');
    }
  }
  // tạo customer
  async register(userInfo: UserInfo, res: any) {
    const { password, email } = userInfo;
    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await this.CustomersService.findUserbyEmail({ email });

    if (existingUser) {
      // Nếu email đã tồn tại, trả về lỗi
      return res.status(400).json({
        message: 'Email already in use',
      });
    }
    // hash
    const hash = hashPasswordFunc({
      password: password,
    });

    try {
      // Lưu vào database và đợi kết quả
      userInfo.password = hash;
      // tạo customer
      const result = await this.CustomersService.createUser1({
        ...userInfo,
        // chưa kích hoạt
        isActive: false,
        codeId: uuidv4().slice(0, 4),
        codeExprided: dayjs().add(5, 'minutes').toDate(),
      });

      // // Trả mã code về email khi người dùng được đăng ký thành công
      // this.mailerService.sendMail({
      //   to: userInfo.email, // list of receivers
      //   from: 'noreply@nestjs.com', // sender address
      //   subject: 'Activate your Account at Hồng Sơn Star ✔', // Subject line

      //   template: './register',
      //   context: {
      //     name: result.username ?? result.email,
      //     activationCode: result.codeId,
      //   },
      // });
      // //
      return res.status(201).json({
        Iduser: result.id,
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      return res.status(500).json({
        message: 'Error registering user',
      });
    }
  }
  async handleActive(dataActive: ActiveAcount) {
    const { codeId, id } = dataActive;

    if (!id || !codeId) {
      throw new Error('Missing id or codeId');
    }

    const user = await this.CustomersService.findOne({
      id: id,
      codeId: codeId,
    });

    if (!user) {
      throw new Error(`User with id: ${id} and codeId: ${codeId} not found`);
    }
    const isBeforeCheck = dayjs().isBefore(user.codeExprided);
    if (isBeforeCheck) {
      await this.CustomerRepository.update(
        { id },
        {
          isActice: true,
        },
      );
    } else {
      throw new BadRequestException(
        'Đã hết hạn mã code.Vui lòng resend email lại để lấy mã mới! ',
      );
    }

    return {
      status: 200,
      message: 'Kích hoạt thành công',
    };
  }

  async retryActive(email: string) {
    const user = await this.CustomerRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Không tồn tại user');
    }

    const codeId = uuidv4();
    await this.CustomerRepository.update(
      { email },
      {
        codeId: codeId.slice(0, 4),
        codeExprided: dayjs().add(5, 'minutes').toDate(),
      },
    );

    // this.mailerService.sendMail({
    //   to: user.email, // list of receivers
    //   from: 'ngodinhphuoc100@gmail.com', // sender address
    //   subject: 'Retry Active your Account at Hồng Sơn Star ✔', // Subject line

    //   template: './register',
    //   context: {
    //     name: user.username ?? user.email,
    //     activationCode: codeId.slice(0, 4),
    //   },
    // });

    return {
      id: user.id,
    };
  }

  async retryPassword(email: string) {
    const user = await this.CustomerRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Không tồn tại user');
    }

    const codeId = uuidv4();

    // Cập nhật lại thông tin user
    await this.CustomerRepository.update(
      { email },
      {
        codeId: codeId.slice(0, 4),
        codeExprided: dayjs().add(5, 'minutes').toDate(),
      },
    );

    // // send email
    // this.mailerService.sendMail({
    //   to: user.email, // list of receivers
    //   from: 'ngodinhphuoc100@gmail.com', // sender address
    //   subject: 'Retry Active your Account at Hồng Sơn Star ✔', // Subject line

    //   template: './register',
    //   context: {
    //     name: user.username ?? user.email,
    //     activationCode: codeId.slice(0, 4),
    //   },
    // });

    // Trả email
    return {
      id: user.id,
      email: user.email,
    };
  }
  async changePassword(dataActive: ChangeAcount) {
    const { email, password, confirmpassword, codeId } = dataActive;
    // Kiểm tra xem người dùng có tồn tại không, tìm cả theo email và codeId
    const existingUser = await this.CustomersService.findUserbyEmailAndCodeId({
      email,
      codeId,
    });

    if (!existingUser) {
      return {
        message: 'Email hoặc codeId không tồn tại',
      };
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (password !== confirmpassword) {
      // Nếu mật khẩu và xác nhận mật khẩu không khớp
      return {
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
      };
    }
    // hash
    const hash = hashPasswordFunc({ password });
    try {
      const isBeforeCheck = dayjs().isBefore(existingUser.codeExprided);
      if (isBeforeCheck) {
        await this.CustomerRepository.update(
          { email },
          {
            password: hash, // Cập nhật mật khẩu đã được hash
          },
        );
      } else {
        throw new BadRequestException(
          'Đã hết hạn mã code.Vui lòng resend email lại để lấy mã mới! ',
        );
      }

      return {
        message: 'Mật khẩu đã được thay đổi thành công',
      };
    } catch (error) {
      // Xử lý lỗi nếu có
      return {
        message: 'Đã có lỗi xảy ra khi cập nhật mật khẩu',
      };
    }
  }

  async retryPasswordAdmin(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Không tồn tại user');
    }

    const codeId = uuidv4();

    // Cập nhật lại thông tin user
    await this.usersRepository.update(
      { email },
      {
        codeId: codeId.slice(0, 4),
        codeExprided: dayjs().add(5, 'minutes').toDate(),
      },
    );

    // // send email
    // this.mailerService.sendMail({
    //   to: user.email, // list of receivers
    //   from: 'ngodinhphuoc100@gmail.com', // sender address
    //   subject: 'Retry Active your Account at Hồng Sơn Star ✔', // Subject line

    //   template: './register',
    //   context: {
    //     name: user.username ?? user.email,
    //     activationCode: codeId.slice(0, 4),
    //   },
    // });

    // Trả email
    return {
      id: user.id,
      email: user.email,
    };
  }
  async changePasswordAdmin(dataActive: ChangeAcount) {
    const { email, password, confirmpassword, codeId } = dataActive;
    // Kiểm tra xem người dùng có tồn tại không, tìm cả theo email và codeId
    const existingUser = await this.userService.findUserbyEmailAndCodeId({
      email,
      codeId,
    });

    if (!existingUser) {
      return {
        message: 'Email hoặc codeId không tồn tại',
      };
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (password !== confirmpassword) {
      // Nếu mật khẩu và xác nhận mật khẩu không khớp
      return {
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
      };
    }
    // hash
    const hash = hashPasswordFunc({ password });
    try {
      const isBeforeCheck = dayjs().isBefore(existingUser.codeExprided);
      if (isBeforeCheck) {
        await this.CustomerRepository.update(
          { email },
          {
            password: hash, // Cập nhật mật khẩu đã được hash
          },
        );
      } else {
        throw new BadRequestException(
          'Đã hết hạn mã code.Vui lòng resend email lại để lấy mã mới! ',
        );
      }

      return {
        message: 'Mật khẩu đã được thay đổi thành công',
      };
    } catch (error) {
      // Xử lý lỗi nếu có
      return {
        message: 'Đã có lỗi xảy ra khi cập nhật mật khẩu',
      };
    }
  }

  async validateGoogleUser(profile: any) {
    const { email, firstName, lastName, picture } = profile;
    let user = await this.CustomersService.getCustomerByEmail(email);
    const codeId = uuidv4();
    const role_user = await this.RoleRepository.findOne({
      where: { name: RoleEnum.USER },
    });
    if (!user)
      user = await this.CustomerRepository.create({
        email,
        username: firstName + ' ' + lastName,
        Roles: role_user,
        avatarUrl: picture,
        codeId: codeId.slice(0, 4),
        codeExprided: dayjs().add(5, 'minutes').toDate(),
        isActice: true,
      });
    // Lưu người dùng mới vào cơ sở dữ liệu
    await this.CustomerRepository.save(user);

    const accessPayload = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.Roles.name,
    };
    const refreshPayload = {
      id: user.id,
      email: user.email,
      role: user.Roles.name,
      username: user.username,
    };
    const users = {
      username: user.username,
      email: user.email,
      role: user.Roles.name,
      avatarUrl: user.avatarUrl,
      age: user.age,
      gender: user.gender,
      isActice: true,
    };
    return {
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED'),
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
      users,
    };
  }

  async validateFacebookUser(profile: any) {
    const { email, firstName, lastName } = profile;
    let user = await this.CustomersService.getCustomerByEmail(email);
    const codeId = uuidv4();
    if (!user) {
      const role_user = await this.RoleRepository.findOne({
        where: { name: RoleEnum.USER },
      });
      //Tạo người dùng mới nếu chưa tồn tại
      user = await this.CustomerRepository.create({
        email,
        username: firstName + ' ' + lastName,
        Roles: role_user,
        codeId: codeId.slice(0, 4),
        codeExprided: dayjs().add(5, 'minutes').toDate(),
        isActice: true,
      });
    }
    // Lưu người dùng mới vào cơ sở dữ liệu
    await this.CustomerRepository.save(user);

    const accessPayload = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.Roles.name,
    };
    const refreshPayload = {
      id: user.id,
      email: user.email,
      role: user.Roles.name,
      username: user.username,
    };
    const users = {
      username: user.username,
      email: user.email,
      role: user.Roles.name,
      avatarUrl: user.avatarUrl,
      age: user.age,
      gender: user.gender,
    };
    return {
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED'),
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
      users,
    };
  }

  // async sendMailAdmin_ResponseCustomer(infoContact_OfCustomer) {
  //   const emailAdmin = 'ngodinhphuoc100@gmail.com';
  //   this.mailerService.sendMail({
  //     to: emailAdmin, // list of receivers
  //     from: 'noreply@nestjs.com', // sender address
  //     subject: 'Thông tin báo giá từ khách hàng Ô Tô Hồng Sơn ✔', // Subject line

  //     template: './contactPrice',
  //     context: {
  //       name: infoContact_OfCustomer.name ?? infoContact_OfCustomer?.email,
  //       email: infoContact_OfCustomer?.email,
  //       phone: infoContact_OfCustomer?.phone,
  //       note: infoContact_OfCustomer?.note,
  //     },
  //   });

  //   this.mailerService.sendMail({
  //     to: infoContact_OfCustomer.email, // list of receivers
  //     from: 'noreply@nestjs.com', // sender address
  //     subject: 'Phản Hồi Đến Khách Hàng Ô Tô Hồng Sơn ✔', // Subject line

  //     template: './thankyou',
  //     context: {
  //       name: infoContact_OfCustomer.name ?? infoContact_OfCustomer?.email,
  //     },
  //   });
  //   return infoContact_OfCustomer;
  // }

  async forgotPassword({
    email,
    config = { isAdmin: true },
  }: ForgotPassword): Promise<ResponseFunc> {
    try {
      return await this.usersRepository.manager.transaction(async (manager) => {
        const user = (await this.handleValidation(
          { email },
          { isAdmin: config.isAdmin, isGenerateToken: false },
        )) as User | Customer;

        const appConfig = this.configService.get<AppConfig>(APP_CONFIG_TOKEN);
        const { token, expires } = generateResetToken(user.id);
        let resetPasswordUrl: string;
        if (user instanceof Customer)
          resetPasswordUrl = `${appConfig.FE_URL_USER}/reset-password?token=${token}`;
        else
          resetPasswordUrl = `${appConfig.FE_URL_ADMIN}/reset-password?token=${token}`;
        const { success, message } = await this.mailerService.sendMailFunc({
          to: email,
          subject: 'Quên mật khẩu',
          context: {
            name: user.username,
            resetPasswordUrl: resetPasswordUrl,
          },
          template: './forgotPassword',
        });

        user.codeId = token;
        user.codeExprided = expires;
        await manager.save(user);
        return {
          status: success,
          data: null,
          message: message,
        };
      });
    } catch (error) {
      throw error;
    }
  }
  async verifyResetPasswordToken({
    token,
    config = { isAdmin: true },
  }: VerifyResetPassword): Promise<ResponseFunc<User | Customer | undefined>> {
    try {
      let user: User | Customer;
      if (config.isAdmin)
        user = await this.usersRepository.findOne({
          where: {
            codeId: token,
          },
        });
      else
        user = await this.CustomerRepository.findOne({
          where: { codeId: token },
        });
      if (
        !user ||
        !user.codeExprided ||
        Date.now() > user.codeExprided.getTime()
      ) {
        return { status: 400, message: 'Token không hợp lệ hoặc đã hết hạn' };
      }
      return { status: 200, message: 'Token hợp lệ', data: user };
    } catch (error) {
      console.error('Xác thực token reset password lỗi', error);
      return { status: 400, message: 'Có lỗi xảy ra. Vui lòng thử lại sau' };
    }
  }
  async resetPassword({
    token,
    newPassword,
    config = { isAdmin: true },
  }: ResetPassword): Promise<ResponseFunc> {
    try {
      let user: Customer | User | undefined;
      user = (
        await this.verifyResetPasswordToken({
          token: token,
          config: { isAdmin: config.isAdmin },
        })
      )?.data;
      if (!user)
        throw new UnauthorizedException('User hoặc token không hợp lệ');
      const hashedPassword = hashPasswordFunc({ password: newPassword });
      await this.usersRepository.manager.transaction(async (manager) => {
        user.password = hashedPassword;
        user.codeId = null;
        user.codeExprided = null;
        await manager.save(user);
      });

      return {
        status: 200,
        message: 'Mật khẩu đã được đặt lại thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}
