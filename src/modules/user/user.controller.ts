import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Public } from 'src/decorators/public-route';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { FileValidationPipe } from 'src/pipe/file-validation.pipe';
import { RoleEnum } from 'src/constants/role.enum';
import { Roles } from 'src/decorators/role-route';
import { UploadImageReponseDto } from './dto/UploadImageReponseDto.dto';
import QueryUserDto from './dto/query-user.dto';

@ApiTags(Tag.USER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({
    summary:
      'Upload/Create an Image for Users trả về url image . Kết hợp vs API create users   ',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Image uploaded successfully',
    type: UploadImageReponseDto, // Đảm bảo `UploadImageReponseDto` được định nghĩa đúng
  })
  @Public()
  @Post('create/uploadImage')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
  ): Promise<UploadImageReponseDto> {
    return this.userService.uploadImage(image);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @Post()
  @ApiOperation({ summary: 'create user trả về gmail mật khẩu' })
  @ApiResponse({ status: 201, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request - User already exist' })
  create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.userService.createUser(createUserDto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Cập nhật avatar/ upload  avatar khi tài khoản đó đã đăng nhập để gửi token giải mã lấy thông tin tài khoản đó.  Role [admin, sale,manager,staff] ',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully uploaded',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://res.cloudinary.com/user/avatar.png',
        },
        public_id: { type: 'string', example: 'avatar_12345' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Cloudinary-specific error',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Cloudinary failure',
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.userService.uploadAvatar(file, req.user);
  }
  // update user
  // @ApiBearerAuth()

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({
    summary:
      'update user information . Chỉ admin và quản lí của hàng cập nhật ',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiResponse({ status: 201, description: 'Successful operation 1 ' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiParam({
    name: 'id',
    example: '682f8315-3843-48ce-8fd7-24c725272890',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    // @Wallet() walletAddress: string,'
    @Req() req: Request,
  ) {
    return this.userService.update(id, updateUserDto, req.user);
  }

  @ApiOperation({ summary: ' Xóa user' })
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiResponse({ status: 201, description: 'Successful operation 1 ' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.remove(id);
  }
  @Public()
  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getAllUser(@Query() query: QueryUserDto) {
    return this.userService.getAll(query);
  }
  @ApiParam({
    name: 'id',
    example: '682f8315-3843-48ce-8fd7-24c725272890',
  })
  @Public()
  @Get(':id')
  async getUserbyId(@Param('id') id: string) {
    return this.userService.getFindById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update user role' })
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiNotFoundResponse({ description: 'Invalid user address' })
  @Roles(RoleEnum.ADMIN)
  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req: Request,
  ) {
    return this.userService.updateRole(id, updateUserRoleDto, req.user);
  }
  // Tạo nhiều users
  @ApiBearerAuth()
  @Post('/callBulkCreateUser')
  @ApiBody({ type: [CreateUserDto] }) // Swagger tự hiểu đây là một mảng
  @ApiResponse({ status: 201, description: 'Users created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - User already exist' })
  createManyUser(@Body() createUserDto: CreateUserDto[], @Req() req: Request) {
    return this.userService.createManyUsers(createUserDto, req.user);
  }
}
