import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // ✅ 开启跨域支持（前端才能请求）

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
