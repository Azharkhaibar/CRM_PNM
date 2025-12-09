"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    app.useGlobalPipes(new common_1.ValidationPipe({
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
            return new common_1.BadRequestException({
                message: 'Validation failed',
                errors: messages,
            });
        },
    }));
    const configSwagger = new swagger_1.DocumentBuilder()
        .setTitle('CRM-PNM')
        .setVersion('1.0')
        .setDescription('Swagger CRM Documentation')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, configSwagger);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT ?? 5530;
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`📚 Swagger: http://localhost:${port}/api`);
    console.log(`🔍 Stratejik: http://localhost:${port}/api/v1/stratejik`);
}
bootstrap();
//# sourceMappingURL=main.js.map