import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://7659fd5f8b3f.ngrok-free.app',
      'https://a070771a5176.ngrok-free.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: false,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        console.log('❌ Validation Error:', errors);
        const messages = errors.map((error) => {
          const constraints = Object.values(error.constraints || {});
          return `${error.property}: ${constraints.join(', ')}`;
        });
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('CRM-PNM')
    .setVersion('1.0')
    .setDescription('Swagger CRM Documentation')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 5530;
  await app.listen(port, '0.0.0.0');

  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/api`);
  console.log(`🔍 Stratejik: http://localhost:${port}/api/v1/stratejik`);
}
bootstrap();
