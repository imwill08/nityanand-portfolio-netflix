import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  // Enable CORS so the Next.js frontend can connect
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix for API endpoints: e.g. /api/portfolio, /api/auth/login
  app.setGlobalPrefix('api');

  // Input validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    }),
  );

  await app.listen(port);
  logger.log(`Portfolio Nest.js backend is running on: http://localhost:${port}/api`);
}

bootstrap();
