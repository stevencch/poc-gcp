import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { getLoggingLevels, isRunningLocally } from '@poc-gcp/common';
import express from 'express';
import { ErrorHandlerModule } from './app/error-handler.module';
import { http } from '@google-cloud/functions-framework';

let app: INestApplication<express.Express>;
const server = express();
const port = process.env.NEST_PORT || 3003;
const host = process.env.HOST || '0.0.0.0';

async function bootstrap() {
  const loggingLevels = getLoggingLevels();
  app = await NestFactory.create(
    ErrorHandlerModule,
    new ExpressAdapter(server),
    {
      logger: loggingLevels,
    }
  );
  app.enableCors();
  await app.listen(port, host);
  return app;
}

http('handler', async (req: express.Request, res: express.Response) => {
  app = app ?? (await bootstrap());
  await server(req, res);
});

if (isRunningLocally()) {
  bootstrap()
    .then(() => Logger.log(`Application running on port ${port}`))
    .catch((err) => console.log(err));
}
