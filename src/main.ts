import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Tag } from './constants/api-tag.enum';
import { AllExceptionsFilter } from './exception/exception.filter';
import { validationPipeExceptionFactory } from './helpers/format-error';
import { TransformInterceptor } from './interceptor/transfrom.interceptor';
import { writeFileSync } from 'fs';
import { APP_CONFIG_TOKEN, AppConfig } from './config/app.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>(APP_CONFIG_TOKEN);
  const port = configService.get('PORT') || 9000;
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // tránh mất dữ liệu khi update
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: validationPipeExceptionFactory,
    }),
  );
  //Sử dụng Interceptor để format response thành công
  // Đăng ký TransformInterceptor toàn cục
  // Lấy Reflector từ app container và truyền vào interceptor
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  // const allowedOrigins = [
  //   'https://dehype.fun',
  //   'https://www.dehype.fun',
  //   // Add any other allowed origins here
  // ];

  // app.enableCors({
  //   origin: (origin, callback) => {
  //     // Allow requests with no origin (like mobile apps or curl requests)
  //     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
  });

  // cấu hình
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('HS API docs')
    .setDescription('HS API description')
    .setVersion('1.0')
    .setExternalDoc(
      'Know more about swagger structure with swagger editor',
      'https://editor.swagger.io/?_gl=1*1xyqdcp*_gcl_au*NTg5MjIwNjEuMTc0MDE3NjY3Ng..',
    )
    .addTag('HS')
    .addServer(appConfig.BE_URL)
    .addServer(appConfig.DEPLOY_BE_URL_NGROK)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const allTags = Object.values(Tag).map((tag) => ({ name: tag }));
  document.tags = allTags;
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customCss: `
    .swagger-ui .renderedMarkdown code {
      background-color: #333333;
      padding: 0.2em 0.4em;
      font-size: 12px;
      color: #fff;
    }
  `,
  });

  app.getHttpAdapter().get('/api/v1/api/api-json', (req, res) => {
    res.json(document);
  });

  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  console.log(`Server running on port ${port}`);

  const shouldListen = process.env.CPANEL_UI !== 'true';
  // Bind to all IPv4 addresses
  if (shouldListen) {
    await app.listen(port, '0.0.0.0');
  } else {
    console.log('Running inside cPanel UI.');
  }
}
bootstrap();
