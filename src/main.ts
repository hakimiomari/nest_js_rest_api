import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Description and usage')
    .setVersion('1.0')
    .addTag('API')
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // allow the origin
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 8002);
}
bootstrap();
