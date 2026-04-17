import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // đăng ký ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // những trường data hợp lệ được khai báo trong dto
      forbidNonWhitelisted: true, // báo cho client biết trường nào không đc phép gửi, forbidNonWhitelisted + whitelist đi chung
      transform: true, // chuyển đổi kiểu dữ liệu dựa trên kiểu dự liệu bạn đã khai báo
      transformOptions: { enableImplicitConversion: true }, // tự suy luận kiểu dữ liệu và chuyển đổi tự động kể cả khi bạn không dùng decorator khai báo rõ ràng
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
