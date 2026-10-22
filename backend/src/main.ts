import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const frontendUrlEnv = configService.get<string>('FRONTEND_URL') || '';

  // Parse comma-separated FRONTEND_URL entries (e.g., http://localhost:3000,https://my-app.vercel.app)
  const configuredOrigins = frontendUrlEnv
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  // Default allowed local development origins
  const devOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://nityanand-portfolio-netflix.vercel.app',
  ];

  const allowedOrigins = Array.from(
    new Set([...configuredOrigins, ...(isProduction ? [] : devOrigins)]),
  );

  logger.log(
    `Configured CORS allowed origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'None'}`,
  );

  // Secure CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, Postman, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      // Check against explicit allowed origins or wildcard patterns (e.g., https://*.vercel.app)
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === normalizedOrigin) return true;
        if (allowed.includes('*')) {
          const regex = new RegExp(
            `^${allowed.replace(/\./g, '\\.').replace(/\*/g, '[a-zA-Z0-9_-]+')}$`,
          );
          return regex.test(normalizedOrigin);
        }
        return false;
      });

      if (isAllowed) {
        return callback(null, true);
      }

      // In non-production, permit any localhost / 127.0.0.1 port for flexibility during development
      if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
        return callback(null, true);
      }

      // Reject unauthorized origins
      logger.warn(`[CORS] Rejected request from unauthorized origin: ${origin}`);
      return callback(null, false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
    ],
    credentials: true,
    maxAge: 86400, // Cache preflight OPTIONS responses for 24 hours
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

  await app.listen(port, '0.0.0.0');
  logger.log(`Portfolio Nest.js backend is running on: http://0.0.0.0:${port}/api`);
}

bootstrap();
