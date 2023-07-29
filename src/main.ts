import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/v1/api');

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey', // this should be apiKey
        name: 'api-key', // this is the name of the key you expect in header
        in: 'header',
      },
      'access-key', // this is the name to show and used in swagger
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(5000);
}
bootstrap();
