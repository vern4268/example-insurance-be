import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Example Insurance Swagger Doc')
        .setDescription('API documentation for the Example Insurance BE')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth')
        .addTag('Products')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('swagger', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
