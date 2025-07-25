import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://guru-shish-dd3x.vercel.app',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3043;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
