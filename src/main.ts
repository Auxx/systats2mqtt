import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function getPortNumber() {
  if (process.env.hasOwnProperty('HTTP_PORT')) {
    const port = parseFloat(process.env[ 'HTTP_PORT' ]);

    if (!Number.isNaN(port)) {
      return port;
    }
  }

  return 3000;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(getPortNumber());
}

bootstrap().then();
