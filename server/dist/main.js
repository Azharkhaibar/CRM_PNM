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
            'https://8f92cc5d4764.ngrok-free.app',
            'https://41c5e7ce0093.ngrok-free.app',
        ],
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const configSwagger = new swagger_1.DocumentBuilder()
        .setTitle('CRM-PNM')
        .setVersion('1.0')
        .setDescription('Swagger CRM Documentation')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, configSwagger);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 5530, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map