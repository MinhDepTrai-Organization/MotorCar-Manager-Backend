import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/gaurds/jwt-auth.guard';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MarketCommentModule } from './modules/market-comment/market-comment.module';
import googleOauthConfig from './config/google-oauth.config';
import typeorm from './config/typeorm.config';
import { BlogModule } from './modules/blog/blog.module';
import { BlockUserModule } from './modules/block-user/block-user.module';
import { CategoryModule } from './modules/category/category.module';
import { SearchModule } from './modules/search/search.module';
import { ProductsModule } from './modules/products/products.module';
import { CarImageModule } from './modules/car-image/car-image.module';
import { BrandModule } from './modules/brand/brand.module';
import { BranchModule } from './modules/branch/branch.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';

import { MailerModule } from '@nestjs-modules/mailer';
import { CustomersModule } from './modules/customers/customers.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ZaloPaymentModule } from './modules/zalo-payment/zalo-payment.module';
import { SkusModule } from './modules/skus/skus.module';
import { DetailImportModule } from './modules/detail_import/detail_import.module';
import { OptionModule } from './modules/option/option.module';
import { OptionValueModule } from './modules/option_value/option_value.module';
import { ImportModule } from './modules/import/import.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { MessageModule } from './modules/message/message.module';
import { BlogCategoriesModule } from './modules/blog-categories/blog-categories.module';
import { DeliveryMethodModule } from './modules/delivery_method/delivery_method.module';
import { ChatgatewayModule } from './modules/chatgateway/chatgateway.module';
import { ExportModule } from './modules/export/export.module';
import { DetailExport } from './modules/detail_export/entities/detail_export.entity';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart_item/cart_item.module';

import { VourchersModule } from './modules/vourchers/vourchers.module';
import { UserVourcherModule } from './modules/user_vourcher/user_vourcher.module';
import { TypeVoucherModule } from './modules/type_voucher/type_voucher.module';
import { PermissionModule } from './modules/permission/permission.module';

import { RoleModule } from './modules/role/role.module';
import { ProvinceModule } from './modules/province/province.module';
import { DistrictModule } from './modules/district/district.module';
import { WardModule } from './modules/ward/ward.module';
import { ReceiveAddressModule } from './modules/receive_address/receive_address.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentMethodModule } from './modules/payment_method/payment_method.module';
import { OrderDetailModule } from './modules/order_detail/order_detail.module';
import { DeliveryStatusModule } from './modules/delivery_status/delivery_status.module';
import { ReviewModule } from './modules/review/review.module';
import { ImagesVideosModule } from './modules/images_videos/images_videos.module';
import { PaymentMethodOptionModule } from './modules/payment_method_option/payment_method_option.module';
import { OrderPaymentMethodOptionModule } from './modules/order_payment_method_option/order_payment_method_option.module';
import { SpecificationModule } from './modules/specification/specification.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptor/transfrom.interceptor';
import { Reflector } from '@nestjs/core';
import { PayosModule } from './modules/payos/payos.module';
import { PaymentTransactionModule } from './modules/payment_transaction/payment_transaction.module';
import { ContactModule } from './modules/contact/contact.module';
import jwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';
import mailerConfig from './config/mailer.config';
import typeormConfig from './config/typeorm.config';
import appConfig from './config/app.config';
import facebookOauthConfig from './config/facebook-oauth.config';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [
        typeorm,
        googleOauthConfig,
        jwtConfig,
        refreshJwtConfig,
        mailerConfig,
        appConfig,
        facebookOauthConfig,
      ],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync(typeormConfig.asProvider()),
    AuthModule,
    UserModule,
    CloudinaryModule,
    MarketCommentModule,
    BlogModule,
    BlockUserModule,
    CategoryModule,
    SearchModule,
    ProductsModule,
    CarImageModule,
    BrandModule,
    BranchModule,
    WarehouseModule,
    CustomersModule,
    ZaloPaymentModule,
    SkusModule,
    DetailImportModule,
    OptionModule,
    OptionValueModule,
    ImportModule,
    ConversationModule,
    MessageModule,
    ChatgatewayModule,
    ExportModule,
    DetailExport,
    CartModule,
    CartItemModule,
    VourchersModule,
    UserVourcherModule,
    TypeVoucherModule,
    PermissionModule,
    RoleModule,
    ReceiveAddressModule,
    SpecificationModule,
    MailerModule.forRootAsync(mailerConfig.asProvider()),
    BlogCategoriesModule,
    DeliveryMethodModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    ReceiveAddressModule,
    OrderModule,
    PaymentMethodModule,
    OrderDetailModule,
    DeliveryStatusModule,
    ReviewModule,
    ImagesVideosModule,
    PaymentMethodOptionModule,
    OrderPaymentMethodOptionModule,
    PayosModule,
    PaymentTransactionModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [
    Reflector,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
