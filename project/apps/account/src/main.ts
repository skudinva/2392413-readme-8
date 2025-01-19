import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('The «Account» service')
    .setDescription('Account service API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer `,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
      },
      'accessToken'
    )
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer `,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
      },
      'refreshToken'
    )
    .build();
  const GLOBAL_PREFIX = 'api';
  app.setGlobalPrefix(GLOBAL_PREFIX);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
