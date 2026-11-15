import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

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

  // Root portal and health endpoints
  const httpAdapter = app.getHttpAdapter();
  const htmlPath = path.join(__dirname, '..', 'public', 'index.html');

  const servePortal = (req: { headers: { accept?: string } }, res: { send: (html: string) => void; json: (o: object) => void; setHeader: (k: string, v: string) => void }) => {
    if (req.headers.accept?.includes('application/json')) {
      return res.json({
        name: 'Library Management API',
        version: '1.0.0',
        endpoints: ['/auth', '/genres', '/books', '/users'],
      });
    }

    if (fs.existsSync(htmlPath)) {
      res.setHeader('Content-Type', 'text/html');
      return res.send(fs.readFileSync(htmlPath, 'utf8'));
    }

    res.json({
      name: 'Library Management API',
      version: '1.0.0',
      endpoints: ['/auth', '/genres', '/books', '/users'],
    });
  };

  httpAdapter.get('/', servePortal);
  httpAdapter.get('/login', servePortal);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Library API running on http://localhost:${port}`);
}

bootstrap();
