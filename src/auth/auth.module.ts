import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { BlockUserModule } from 'src/modules/block-user/block-user.module';
import { User } from 'src/modules/user/entities/user.entity';
import { GoogleStrategy } from './strategy/google.strategy ';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { Role } from 'src/modules/role/entities/role.entity';
import jwtConfig from 'src/config/jwt.config';
import { CustomMailService } from 'src/modules/mail/mail.service';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UserModule,
    PassportModule,
    BlockUserModule,
    TypeOrmModule.forFeature([User, Role]),
    CustomersModule,
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
    FacebookStrategy,
    CustomMailService,
  ],
})
export class AuthModule {}
