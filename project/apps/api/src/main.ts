import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestIdInterceptor } from '@project/interceptors';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const config = new DocumentBuilder()
    .setTitle('Readme app')
    .setDescription('Readme app API')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix(globalPrefix);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);
  app.useGlobalInterceptors(new RequestIdInterceptor());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
