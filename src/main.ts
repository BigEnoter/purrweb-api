import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Purrweb API")
    .setDescription("API по тз для Purrweb")
    .addTag("Purrweb")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api_docs", app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
