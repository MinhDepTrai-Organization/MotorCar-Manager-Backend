import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './passport/jwt.strategy';
import { RefreshStrategy } from './passport/refresh.strategy';
import { BlockUserModule } from 'src/modules/block-user/block-user.module';
import { User } from 'src/modules/user/entities/user.entity';
import { GoogleStrategy } from './passport/google.strategy ';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { FacebookStrategy } from './passport/facebook.strategy';
import { Role } from 'src/modules/role/entities/role.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PassportModule,
    BlockUserModule,
    TypeOrmModule.forFeature([User,Role]),
    CustomersModule,
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
})
export class AuthModule {}
