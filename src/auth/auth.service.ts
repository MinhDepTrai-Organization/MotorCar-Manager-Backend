import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import nacl, { randomBytes } from 'tweetnacl';
import {
  ActiveAcount,
  ChangeAcount,
  ConfirmInfo,
  getAccountDto,
  LoginDto,
  UserInfo,
} from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { pseudoRandomBytes } from 'crypto';
import base58 from 'bs58';
import { PublicKey, Transaction } from '@solana/web3.js';
import { instanceToPlain } from 'class-transformer';
import { BlockUserService } from 'src/modules/block-user/block-user.service';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
const ms = require('ms');
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { CustomersService } from 'src/modules/customers/customers.service';
import { RoleEnum } from 'src/constants/role.enum';
import { Role } from 'src/modules/role/entities/role.entity';
import { Exception } from 'handlebars';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private CustomersService: CustomersService,
    private blockUserService: BlockUserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Customer)
    private CustomerRepository: Repository<Customer>,

    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
  ) {}

  async handleValidate(userInfo: UserInfo, res: Response) {
    // try {
    //   const wallet = userInfo.wallet;
    //   const userData = await this.userService.getUser(wallet);
    //   if (userData)
    //     return res.status(HttpStatus.OK).send(instanceToPlain(userData));
    // } catch (error) {
    //   console.error('Error:', error);
    //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error });
    // }
  }
  /// login customer
  async login(userInfo: LoginDto) {
    try {
      const { email, password } = userInfo;
      // có trả về permission và role
      const user = await this.CustomersService.getCustomerByEmail(email);

      if (!user) {
        throw new NotFoundException('Email không chính xác');
      }
      const check = compareSync(password, user.password); // true
      if (!check) {
        throw new NotFoundException('Mật khẩu không chính xác');
      }
      if (!user.isActice) {
        throw new NotFoundException({
          status: 404,
          message:
            'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản nha',
          data: { code: 2 },
        });
      }

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
      return {
        access_token: this.jwtService.sign(accessPayload),
        refresh_token: this.jwtService.sign(refreshPayload, {
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRED',
          ),
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        }),
        userId: user.id,
        username: user.username,
        email: user.email,
        Roles: user.Roles.name,
        avatarUrl: user.avatarUrl,
        age: user.age,
        birthday: user.birthday,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        permissions: user.Roles.permissions,
      };
    } catch (error) {
      throw error;
    }
  }
  // admin
  async loginAdmin(userInfo: LoginDto) {
    try {
      const { email, password } = userInfo;
      // lấy ra role , permission  nữa nhen
      const user = await this.userService.getUser1(email);

      if (!user) {
        throw new UnauthorizedException('Email không chính xác');
      }
      const check = compareSync(password, user.password); // true
      if (!check) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }

      if (!user.isActice) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message:
              'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản',
            code: 1, // Đưa code = 1 vào response
          },
          HttpStatus.UNAUTHORIZED,
        );
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
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRED',
          ),
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
    } catch (e) {
      console.error('Error in loginAdmin:', e);
      throw e;
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
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(password, salt);

    try {
      // Lưu vào database và đợi kết quả
      userInfo.password = hash;

      // const result = await this.userService.createUser1({
      // tạo customer
      const result = await this.CustomersService.createUser1({
        ...userInfo,
        // chưa kích hoạt
        isActive: false,
        codeId: uuidv4().slice(0, 4),
        codeExprided: dayjs().add(5, 'minutes').toDate(),
      });

      // Trả mã code về email khi người dùng được đăng ký thành công
      this.mailerService.sendMail({
        to: userInfo.email, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Activate your Account at Hồng Sơn Star ✔', // Subject line

        template: './register',
        context: {
          name: result.username ?? result.email,
          activationCode: result.codeId,
        },
      });
      //
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

    this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: 'ngodinhphuoc100@gmail.com', // sender address
      subject: 'Retry Active your Account at Hồng Sơn Star ✔', // Subject line

      template: './register',
      context: {
        name: user.username ?? user.email,
        activationCode: codeId.slice(0, 4),
      },
    });

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

    // send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: 'ngodinhphuoc100@gmail.com', // sender address
      subject: 'Retry Active your Account at Hồng Sơn Star ✔', // Subject line

      template: './register',
      context: {
        name: user.username ?? user.email,
        activationCode: codeId.slice(0, 4),
      },
    });

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
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(password, salt);
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

    // send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: 'ngodinhphuoc100@gmail.com', // sender address
      subject: 'Retry Active your Account at Hồng Sơn Star ✔', // Subject line

      template: './register',
      context: {
        name: user.username ?? user.email,
        activationCode: codeId.slice(0, 4),
      },
    });

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
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(password, salt);
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
    if (!user) {
      //Tạo người dùng mới nếu chưa tồn tại
      const role_user = await this.RoleRepository.findOne({
        where: { name: RoleEnum.USER },
      });
      user = await this.CustomerRepository.create({
        email,
        username: firstName + ' ' + lastName,
        Roles: role_user,
        avatarUrl: picture,
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

  async sendMailAdmin_ResponseCustomer(infoContact_OfCustomer) {
    const emailAdmin = 'ngodinhphuoc100@gmail.com';
    this.mailerService.sendMail({
      to: emailAdmin, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Thông tin báo giá từ khách hàng Ô Tô Hồng Sơn ✔', // Subject line

      template: './contactPrice',
      context: {
        name: infoContact_OfCustomer.name ?? infoContact_OfCustomer?.email,
        email: infoContact_OfCustomer?.email,
        phone: infoContact_OfCustomer?.phone,
        note: infoContact_OfCustomer?.note,
      },
    });

    this.mailerService.sendMail({
      to: infoContact_OfCustomer.email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Phản Hồi Đến Khách Hàng Ô Tô Hồng Sơn ✔', // Subject line

      template: './thankyou',
      context: {
        name: infoContact_OfCustomer.name ?? infoContact_OfCustomer?.email,
      },
    });
    return infoContact_OfCustomer;
  }
}
