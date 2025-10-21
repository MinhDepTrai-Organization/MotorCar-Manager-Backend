import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ActiveAcount,
  Email,
  getAccountDto,
  LoginDto,
  UserInfo,
} from './dto/create-auth.dto';
import { RefreshAuthGuard } from './gaurds/refresh-auth.guard';
import { Public } from 'src/decorators/public-route';
import { GoogleAuthGuard } from './gaurds/google-oauth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/current-user';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import EmailDto from './dto/email-format.dto';
import { ConfigService } from '@nestjs/config';
import { APP_CONFIG_TOKEN, AppConfig } from 'src/config/app.config';
import ResetPassword from './dto/reset-password.dto';
import VerifyResetPasswordDto from './dto/verify-reset-password.dto';
interface User {
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
}

@Public()
@ApiTags(Tag.AUTHENTICATE)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'get access token and refresh token after validate',
  })
  @ApiResponse({
    status: 200,
    description: 'Success get access and refresh token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid user',
  })
  @ResponseMessage('Đăng nhập thành công')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  handleLogin(@Body() userInfo: LoginDto) {
    return this.authService.login(userInfo);
  }

  @ApiOperation({
    summary:
      'Login 4 role: admin, staff,manager,sales and get access token and refresh token after validate',
  })
  @ApiResponse({
    status: 200,
    description: 'Success get access and refresh token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid user',
  })
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  handleLoginAdmin(@Body() userInfo: LoginDto) {
    return this.authService.loginAdmin(userInfo);
  }

  @Post('admin/getAccount')
  @HttpCode(HttpStatus.OK)
  handleGetAccountAdmin(@Body() userInfo: getAccountDto) {
    return this.authService.getAccountAdmin(userInfo);
  }

  @ApiOperation({
    summary: 'Refresh access token cho cả users và customers',
    description: `
      Gửi lên header Authorization với refresh token để lấy access token mới.
      Ví dụ:
      - Header: Authorization: Bearer <refresh_token>
    `,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Access token mới được tạo thành công',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid hoặc missing refresh token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.CREATED)
  handleRefreshToken(@Req() req) {
    return this.authService.refreshAccessToken(req.user);
  }

  // tạo người dùng ở đây
  @ApiOperation({
    summary:
      'Tạo cho customer thôi. Register cho customer. Thành công trả về Id custommer',
  })
  @ApiResponse({ status: 200, description: 'User info is exist in system' })
  @ApiResponse({
    status: 201,
    description: ' user info have created sussessfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server' })
  @Post('register')
  register(@Body() userInfo: UserInfo, @Res() res) {
    return this.authService.register(userInfo, res);
  }
  @ApiOperation({
    summary: 'kích hoạt tài khoản bằng mã code',
  })
  @ApiResponse({ status: 500, description: 'Internal server' })
  @Post('check-code')
  checkCode(@Body() dataActive: ActiveAcount) {
    return this.authService.handleActive(dataActive);
  }

  @Post('retry-active')
  @ApiOperation({
    summary: 'Gửi lại mã kích hoạt tài khoản vào gmail của khách hàng',
  })
  @ApiBody({
    description:
      'The email address of the user to retry the activation process',
    type: Email,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully sent the activation email.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or user not found.',
  })
  retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }

  @Post('retryPassword')
  @ApiOperation({
    summary: 'gửi lại mã code về mail để thay đổi mật khẩu khi chưa login',
  })
  @ApiBody({
    description:
      'The email address of the user to retry the activation process . Trả về Email',
    type: Email,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully sent the activation email.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or user not found.',
  })
  retryPassword(@Body('email') email: string) {
    return this.authService.retryPassword(email);
  }

  // @ApiResponse({ status: 500, description: 'Internal server' })
  // @ApiOperation({ summary: 'Thay đổi mật khẩu mới khi chưa login' })
  // @Post('change-password')
  // changePassword(@Body() dataActive: ChangeAcount) {
  //   return this.authService.changePassword(dataActive);
  // }

  @Post('admin/retryPassword')
  @ApiOperation({
    summary: 'gửi lại mã code về mail để thay đổi mật khẩu khi chưa login ',
  })
  @ApiBody({
    description:
      'The email address of the user to retry the activation process . Trả về Email',
    type: Email,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully sent the activation email.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or user not found.',
  })
  retryPasswordAdmin(@Body('email') email: string) {
    return this.authService.retryPasswordAdmin(email);
  }

  // @ApiResponse({ status: 500, description: 'Internal server' })
  // @ApiOperation({ summary: 'Thay đổi mật khẩu mới khi chưa login' })
  // @Post('admin/change-password')
  // changePassưordAdmin(@Body() dataActive: ChangeAcount) {
  //   return this.authService.changePasswordAdmin(dataActive);
  // }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary:
      'Google Login: có thể gõ theo đường dẫn trên google để chuyển hướng đến google',
    description:
      'Redirects the user to Google for authentication. This endpoint initiates the login process by redirecting the user to Google’s authentication page.',
  })
  googleLogin() {}

  @ApiOperation({
    summary:
      'Sau khi login thành công sẽ trả về URL chứa các tham số như access_token, refresh_token, và users. ' +
      "Trong đó, users cần sử dụng `JSON.parse(decodeURIComponent(urlParams.get('user'))) để giải mã`.",
  })
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google Login Callback',
    description:
      'Handles the callback from Google after the user has authenticated. This endpoint processes the authentication response from Google and retrieves user information.',
  })
  async googleCallback(@Req() req, @Res() res: Response) {
    const user = await this.authService.validateGoogleUser(req.user);
    const appConfig = this.configService.get<AppConfig>(APP_CONFIG_TOKEN);
    let Fe_Url = `${appConfig.FE_URL_USER}/success?token=${user.access_token}`;
    return res.redirect(Fe_Url);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }
  @ApiOperation({
    summary:
      'Sau khi login thành công sẽ trả về URL chứa các tham số như access_token, refresh_token, và users. ' +
      "Trong đó, users cần sử dụng `JSON.parse(decodeURIComponent(urlParams.get('user'))) để giải mã`.",
  })
  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const userFb = req.user as User; // TypeScript sẽ không còn báo lỗi
    const user = await this.authService.validateFacebookUser(userFb);
    // return user;
    console.log('user', user);
    const frontendURL = `${process.env.FE_DEPLOY}/success?token=${user.access_token}`;
    // return res.redirect(
    //   `${frontendURL}?access_token=${user.access_token}&refresh_token=${user.refresh_token}&user=${encodeURIComponent(JSON.stringify(user.users))}`,
    // );
    return res.redirect(frontendURL);
  }

  /////// Liên hệ gửi mail về admin và phản hồi khách hàng
  // @Public()
  // @ApiOperation({
  //   summary: 'Liên hệ gửi mail về admin và phản hồi khách hàng ',
  // })
  // @Post('contact')
  // @ResponseMessage('Báo giá thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất')
  // async sendMailAdmin_ResponseCustomer(@Body() info: InfoContact) {
  //   return await this.authService.sendMailAdmin_ResponseCustomer(info);
  // }

  @ApiOperation({
    summary: 'Quên mật khẩu cho tài khoản',
  })
  @Post('admin/forgot-password')
  @ApiBody({
    type: EmailDto,
    required: true,
    description: 'Email đăng nhập của tài khoản',
  })
  async forgotPassword(@Body() body: EmailDto) {
    return await this.authService.forgotPassword({ email: body.email });
  }

  @ApiOperation({
    summary: 'Xác thực reset password cho admin',
  })
  @Post('admin/verify-reset-password')
  @ApiBody({
    type: VerifyResetPasswordDto,
    required: true,
    description: 'Email đăng nhập của tài khoản',
  })
  async verifyResetPasswordToken(@Body() body: VerifyResetPasswordDto) {
    return await this.authService.verifyResetPasswordToken({
      ...body,
    });
  }

  @ApiOperation({
    summary: 'Thay đổi lại mật khẩu',
  })
  @Post('admin/reset-password')
  async resetPassword(@Body() body: ResetPassword) {
    return this.authService.resetPassword({
      token: body.token,
      newPassword: body.newPassword,
    });
  }
}
