import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createServer } from 'node:http';
import { AppModule } from './app.module.js';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { abortOnError: false });

  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:4200')
      .split(',')
      .map((o) => o.trim()),
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);
}


function servirDiagnostico(err: unknown) {
  const detalle = (err instanceof Error ? err.message : String(err)).replace(
    /\/\/[^@\s/]+@/g,
    '//***:***@',
  );
  console.error('No se pudo iniciar la aplicación:', detalle);

  const cuerpo = JSON.stringify({
    statusCode: 503,
    error: 'El backend no pudo iniciar',
    detalle,
    variablesDefinidas: {
      MONGODB_URI: Boolean(process.env.MONGODB_URI),
      CORS_ORIGIN: Boolean(process.env.CORS_ORIGIN),
    },
  });
  createServer((_req, res) => {
    res.writeHead(503, { 'content-type': 'application/json; charset=utf-8' });
    res.end(cuerpo);
  }).listen(PORT);
}

try {
  await bootstrap();
} catch (err) {
  servirDiagnostico(err);
}
