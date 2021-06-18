import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const ServerConfig = config.get('server');

  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    try {
      app.enableCors({ origin: 'http://localhost:3001' }); // NOTE: Add your frontend server or your domain
    } catch (error) {
      logger.log(
        "Add your frontend server or your domain inside origin of src/main.ts where app.enableCors({ origin: ''}) is . Or just start it on dev mode",
      );
    }
  }

  const port = process.env.PORT || ServerConfig.port;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
