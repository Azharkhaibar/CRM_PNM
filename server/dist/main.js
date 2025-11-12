"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://7659fd5f8b3f.ngrok-free.app',
            'https://a070771a5176.ngrok-free.app',
        ],
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (errors) => {
            console.error('❌ Validation Error:', errors);
            return new common_1.BadRequestException(errors);
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
}
bootstrap();
//# sourceMappingURL=main.js.map