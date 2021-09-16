import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { resolve } from 'path';

import { ClientModule } from '@api/client/client.module';

import { AppModule } from './app.module';
import { AppExceptionFilter } from './common/exceptions/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: true
  });

  const swaggerClientOption = new DocumentBuilder()
    .setTitle('Ecommerce API (Client)')
    .setDescription('The Ecommerce API for Client integration')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const clientDocument = SwaggerModule.createDocument(app, swaggerClientOption, {
    include: [ClientModule],
    deepScanRoutes: true
  });
  SwaggerModule.setup('doc/api/client', app, clientDocument);
  // const authGuard = app.select(AuthModule).get(ClientAuthGuard);

  app.useGlobalFilters(new AppExceptionFilter());
  // app.useGlobalGuards(authGuard);
  app.useStaticAssets(resolve('.', 'public'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      errorHttpStatusCode: 422
    })
  );

  app.enableCors();
  if (process.env.NODE_ENV === 'production') app.use(helmet());
  app.set('trust proxy', 1);
  app.use(compression());

  const port = parseInt(process.env.PORT) || 3000;
  await app.listen(port, () => {
    Logger.log('Listen on port: ' + port);
  });
}
bootstrap();
