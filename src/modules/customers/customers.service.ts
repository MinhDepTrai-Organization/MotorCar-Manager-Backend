import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import {
  ChangePassword_Profile,
  UpdateCustomerDto,
} from './dto/update-customer.dto';
import { FindOneOptions, IsNull, Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { UserInfo } from 'src/auth/dto/create-auth.dto';
import { extractPublicId } from 'cloudinary-build-url';
import { Role } from '../role/entities/role.entity';
import { RoleEnum } from 'src/constants/role.enum';
import { ReviewService } from '../review/review.service';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { Role as UserRole } from '../role/entities/role.entity';
import QueryCustomerDto, {
  SpendingEnumRangeValueMap,
} from './dto/query-customer.dto';
import { SortOrder } from 'src/constants/sortOrder.enum';
import { isUUID } from 'class-validator';
import { convertToTimeStampPostgres } from 'src/helpers/datetime.format';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private CustomerRepository: Repository<Customer>,

    private cloudinaryService: CloudinaryService,
    private jwtService: JwtService,
    private configService: ConfigService,

    @InjectRepository(Role)
    private readonly RoleRepo: Repository<Role>,

    private ReviewService: ReviewService,

    private readonly mailerService: MailerService,

    @InjectRepository(UserRole)
    private roleRepository: Repository<UserRole>,
  ) {}

  getUser = async (id: string) => {
    const user = await this.CustomerRepository.findOne({
      where: {
        id: id || IsNull(),
      },
    });

    return user;
  };
  getCustomerByEmail = async (email: string) => {
    const user = await this.CustomerRepository.findOne({
      relations: ['Roles', 'Roles.permissions'],
      where: {
        email: email,
      },
    });

    return user;
  };
  // cho customer khi đăng kí
  async createUser(createUserDto: CreateCustomerDto) {
    const { password, email } = createUserDto;

    const existingUser = await this.CustomerRepository.findOne({
      relations: ['Roles'],
      where: { email },
    });

    if (existingUser) {
      throw new HttpException(
        'Đã tồn tại người dùng với email này',
        HttpStatus.CONFLICT,
      );
    }
    // hash
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(password, salt);
    // compareSync("B4c0/\/", hash); // true

    // Lưu vào database và đợi kết quả

    const role_user = await this.RoleRepo.findOne({
      where: { name: RoleEnum.USER },
    });

    createUserDto.password = hash;
    const user = this.CustomerRepository.create({
      ...createUserDto,
      Roles: role_user,
    });
    await this.CustomerRepository.save(user);
    return {
      data: user,
    };
  }

  // cho customer ở trang quản lý admin
  async createCustomerByPageAdmin(createUserDto: CreateCustomerDto) {
    const { password, email } = createUserDto;
    if (!password) {
      createUserDto.password = '123456';
    }
    const existingUser = await this.CustomerRepository.findOne({
      relations: ['Roles'],
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Đã tồn tại người dùng với email này');
    }
    // hash
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(createUserDto.password, salt);

    // Lưu vào database và đợi kết quả

    const role_user = await this.RoleRepo.findOne({
      where: { name: createUserDto.role as RoleEnum },
    });

    createUserDto.password = hash;
    const codeId = uuidv4();
    const user = this.CustomerRepository.create({
      ...createUserDto,
      Roles: role_user,

      // kích hoạt luôn
      isActice: true,
      codeId: codeId.slice(0, 4),
      codeExprided: dayjs().add(5, 'minutes').toDate(),
    });
    const customerInfo = await this.CustomerRepository.save(user);
    // Trả mã password  về email khi người dùng được đăng ký thành công
    this.mailerService.sendMail({
      to: customerInfo.email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Account Successfully Created at Ô Tô Hồng Sơn Star ✔', // Subject line

      template: './createAccount',
      context: {
        name: customerInfo.username ?? customerInfo.email,
        password: customerInfo.password,
      },
    });
    return {
      data: user,
    };
  }
  // customer giao diện quản lý
  async createUser1(createUserDto: UserInfo) {
    const role_user = await this.RoleRepo.findOne({
      where: { name: RoleEnum.USER },
    });
    const user = this.CustomerRepository.create({
      ...createUserDto,
      Roles: role_user,
    });
    return await this.CustomerRepository.save(user);
  }

  // tìm thông qua email
  async findUserbyEmail(createUserDto) {
    const { email } = createUserDto;

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await this.CustomerRepository.findOne({
      where: { email },
    });

    return existingUser;
  }

  async findUserbyEmailAndCodeId({
    email,
    codeId,
  }: {
    email: string;
    codeId: string;
  }) {
    const user = await this.CustomerRepository.findOne({
      where: {
        email: email,
        codeId: codeId, // Thêm codeId vào điều kiện tìm kiếm
      },
    });

    return user;
  }

  async uploadAvatar(file: Express.Multer.File, user: any) {
    // return user;
    const { email } = user;
    const userInfo = await this.getCustomerByEmail(email);
    const publicId = extractPublicId(userInfo.avatarUrl);

    if (publicId !== 'User/default') {
      this.cloudinaryService.removeFile(publicId);
    }
    const folder = 'user';
    const uploadResult = await this.cloudinaryService.uploadFile(file, folder);

    this.CustomerRepository.update(userInfo.id, {
      avatarUrl: uploadResult.url,
    });
    // Chỉ lấy `public_id` và `url`
    const { public_id, url } = uploadResult;
    return { url, public_id };
  }

  async findOne(conditions: { id: string; codeId: string }) {
    const options: FindOneOptions<Customer> = {
      where: { id: conditions.id, codeId: conditions.codeId },
    };

    const user = await this.CustomerRepository.findOne(options);
    return user;
  }

  async update(id: string, updateUserDto: UpdateCustomerDto) {
    try {
      // Kiểm tra xem người dùng có tồn tại không
      const existingUser = await this.CustomerRepository.findOne({
        where: { id },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Nếu có Roles thì mới tìm kiếm role tương ứng
      let user_role = existingUser.Roles;
      if (updateUserDto.Roles) {
        const foundRole = await this.roleRepository.findOne({
          where: { name: updateUserDto.Roles as RoleEnum },
        });
        if (!foundRole) {
          throw new NotFoundException('Role not found');
        }
        user_role = foundRole;
      }

      // Cập nhật thông tin người dùng
      await this.CustomerRepository.update(id, {
        ...updateUserDto,
        Roles: user_role,
      });

      // Trả về dữ liệu đã cập nhật
      return this.CustomerRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Giữ nguyên lỗi NotFoundException
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: string) {
    try {
      // Kiểm tra xem người dùng có tồn tại không
      const existingUser = await this.CustomerRepository.findOne({
        where: { id },
        relations: ['reviews'],
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const publicId = extractPublicId(existingUser.avatarUrl);
      if (publicId !== 'User/default') {
        this.cloudinaryService.removeFile(publicId);
      }
      if (existingUser.reviews) {
        for (const review of existingUser.reviews) {
          await this.ReviewService.removeHardReview(review.id);
        }
      }
      // Thực hiện xóa người dùng
      return await this.CustomerRepository.remove(existingUser);
    } catch (error) {
      throw error;
    }
  }

  async getBettingHistory(walletAddress: string) {
    try {
      const user = await this.getUser(walletAddress);
      return {
        user: {
          username: user.username,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error in get user betting history',
      );
    }
  }

  async getAll(query: QueryCustomerDto) {
    try {
      const {
        current = 1,
        pageSize = 10,
        sortOrder = SortOrder.DESC,
        ...filters
      } = query;
      const queryBuilder = this.CustomerRepository.createQueryBuilder('c')
        .leftJoin(
          (subQuery) =>
            subQuery
              .select([
                'ra.customer_id',
                'ra.district as district',
                'ra.province as province',
                'ra.street as street',
                'ra.ward as ward',
                'ra.receiver_phone as receiver_phone',
                'ra.receiver_name as receiver_name',
              ])
              .from('receive_address', 'ra')
              .where(
                'ra.createdAt = ' +
                  subQuery
                    .subQuery()
                    .select('MAX(ra2.createdAt)')
                    .from('receive_address', 'ra2')
                    .where('ra2.customer_id = ra.customer_id')
                    .getQuery(),
              ),
          'ra',
          'ra.customer_id = c.id',
        )
        .leftJoin('c.Roles', 'r')
        .leftJoin(
          (subQuery) =>
            subQuery
              .select([
                'o.customer_id',
                'COUNT(o.id) AS total_order',
                'COALESCE(SUM(o.total_price), 0) AS totalSpending',
              ])
              .from('order', 'o')
              .groupBy('o.customer_id'),
          'os',
          'os.customer_id = c.id',
        );

      if (filters.search) {
        const search = filters.search.trim();
        if (isUUID(search)) {
          queryBuilder.andWhere('c.id = :search', { search });
        } else {
          queryBuilder.andWhere(
            '(c.username ILIKE :search OR c.email ILIKE :search OR c.phoneNumber ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (filters.status) {
        queryBuilder.andWhere('c.isActice = :status', {
          status: filters.status,
        });
      }

      if (filters.created_from && filters.created_to) {
        const from = convertToTimeStampPostgres(filters.created_from);
        const to = convertToTimeStampPostgres(filters.created_to);
        if (from < to) {
          queryBuilder.andWhere('c.joinedAt BETWEEN :from AND :to', {
            from: from,
            to: to,
          });
        } else {
          throw new BadRequestException(
            'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
          );
        }
      }

      if (filters.gender) {
        queryBuilder.andWhere('c.gender = :gender', {
          gender: filters.gender,
        });
      }

      if (filters.spending_range) {
        const { min, max } = SpendingEnumRangeValueMap[filters.spending_range];
        if (max !== null) {
          queryBuilder.andWhere(
            'COALESCE(os.totalSpending, 0) BETWEEN :min AND :max',
            {
              min: min,
              max: max,
            },
          );
        } else {
          queryBuilder.andWhere('COALESCE(os.totalSpending, 0) >= :min', {
            min: min,
          });
        }
      }

      const result = await queryBuilder
        .select([
          'c.*',
          'ra.district',
          'ra.province',
          'ra.street',
          'ra.ward',
          'ra.receiver_phone',
          'ra.receiver_name',
          'r.id',
          'r.name',
          'COALESCE(os.total_order, 0) AS total_order',
          'COALESCE(os.totalSpending, 0) AS total_spending',
        ])
        .orderBy(`c.joinedAt`, sortOrder === SortOrder.DESC ? 'DESC' : 'ASC')
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getRawMany();

      const total = await queryBuilder.getCount();
      const totalPages = Math.ceil(total / pageSize);

      return {
        message: 'Lấy tất cả khách hàng thành công',
        status: 200,
        data: {
          pagination: {
            total,
            pageSize,
            limit: pageSize,
            totalPages,
          },
          result: result.map((item) => ({
            id: item.id,
            username: item.username,
            email: item.email,
            age: item.age,
            avatarUrl: item.avatarUrl,
            gender: item.gender,
            isActice: item.isActice,
            phoneNumber: item.phoneNumber,
            joinedAt: item.joinedAt,
            role: {
              id: item.r_id,
              name: item.r_name,
            },
            receive_address: {
              district: item.district,
              province: item.province,
              street: item.street,
              ward: item.ward,
              receiver_phone: item.receiver_phone,
              receiver_name: item.receiver_name,
            },
            total_order: parseInt(item.total_order, 10),
            total_spending: parseFloat(item.total_spending),
          })),
        },
      };
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      throw new BadRequestException('Error fetching customers');
    }
  }
  async getFindById(id: string) {
    const result = await this.CustomerRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.Roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .leftJoinAndSelect('customer.receive_address', 'receive_address')
      .where('customer.id = :id', { id })
      .select([
        'customer.id',
        'customer.username',
        'customer.email',
        'customer.age',
        'customer.phoneNumber',
        'customer.avatarUrl',
        'customer.birthday',
        'customer.gender',
        'customer.joinedAt',
        'customer.isActice as isActive',

        // Thông tin vai trò
        'role.id',
        'role.name',

        // Thông tin permissions
        'permission.id',
        'permission.name',
        'permission.path',
        'permission.method',
        // 'permission.description',
        'permission.module',

        // Thông tin địa chỉ nhận hàng
        'receive_address.id',
        'receive_address.postal_code',
        'receive_address.is_default',
        'receive_address.street',
        'receive_address.ward',
        'receive_address.district',
        'receive_address.province',
        'receive_address.receiver_name',
        'receive_address.receiver_phone',
        'receive_address.note',
      ])
      .getOne();

    return {
      status: 201,
      data: result,
    };
  }

  async getCustomerById(id: string) {
    const user = await this.CustomerRepository.findOne({
      where: { id },
      relations: ['Roles', 'Roles.permissions'],
      select: [
        'id',
        'username',
        'email',
        'age',
        'avatarUrl',
        'isActice',
        'phoneNumber',
        'gender',
        'joinedAt',
      ],
    });

    // Chỉ trả về thông tin cần thiết, bỏ password
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      age: user.age,
      birthday: user.birthday,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      avatarUrl: user.avatarUrl,
      isActive: user.isActice,
      joinedAt: user.joinedAt,
      codeId: user.codeId,
      codeExprided: user.codeExprided,
      role: user.Roles
        ? {
            // Nếu có role thì trả về object
            id: user.Roles.id,
            name: user.Roles.name,
            permissions: user.Roles.permissions?.map((permission) => ({
              id: permission.id,
              name: permission.name,
              path: permission.path,
              method: permission.method,
              module: permission.module,
            })),
          }
        : null,
    };
  }

  async getProfile(user) {
    const getUser = await this.getCustomerByEmail(user.email);

    if (!user) {
      throw new NotFoundException('Email không chính xác');
    }
    if (!getUser.isActice) {
      throw new NotFoundException({
        status: 404,
        message:
          'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản nha',
        data: { code: 2 },
      });
    }

    try {
      const accessPayload = {
        username: user.username,
        email: user.email,
        id: user.id,
        role: user.role,
      };

      const refreshPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
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
        // fix thêm s thử
        Roles: user.role,
        avatarUrl: getUser.avatarUrl,
        age: user.age,
        birthday: user.birthday,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        permissions: user.permissions,
      };
    } catch (error) {
      throw error;
    }
  }
  async changePassword_InProfile(user, dataActive: ChangePassword_Profile) {
    const { oldPassword, newPassword, confirmPassword } = dataActive;
    const customer = await this.CustomerRepository.findOne({
      where: { email: user.email },
    });
    if (!customer) {
      return {
        success: 404,
        message: 'Không tìm thấy người dùng',
      };
    }

    // So sánh oldPassword (nhập từ form) với password hash trong DB
    const isMatch = compareSync(oldPassword, customer.password);
    if (!isMatch) {
      return {
        status: 422,
        message: 'Mật khẩu cũ không đúng',
      };
    }

    if (newPassword !== confirmPassword) {
      // Nếu mật khẩu và xác nhận mật khẩu không khớp
      return {
        status: 400,
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
      };
    }
    try {
      // hash
      const saltRounds = 10;
      const salt = genSaltSync(saltRounds);
      const hash = hashSync(newPassword, salt);

      // const existingUser = await this.userService.findUserbyEmailAndCodeId({
      await this.CustomerRepository.update(
        { email: user.email },
        { password: hash },
      );
      // Kiểm tra mật khẩu và xác nhận mật khẩu
      return {
        status: 200,
        message: 'Mật khẩu đã được thay đổi thành công',
      };
    } catch (error) {
      // Xử lý lỗi nếu có
      return {
        message: 'Đã có lỗi xảy ra khi cập nhật mật khẩu',
      };
    }
  }
}
