import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const GLOBAL_PREFIX = 'api';
  const config = new DocumentBuilder()
    .setTitle('The «Blog» service')
    .setDescription('Blog service API')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix(GLOBAL_PREFIX);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
