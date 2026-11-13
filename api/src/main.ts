import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,       // auto-convert types (string -> number etc.)
    }),
  );

  app.enableCors();

  // Root health-check / index route
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/', (_req: unknown, res: { json: (o: object) => void }) => {
    res.json({
      name: 'Library Management API',
      version: '1.0.0',
      endpoints: ['/genres', '/books', '/users'],
    });
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Library API running on http://localhost:${port}`);
}

bootstrap();

