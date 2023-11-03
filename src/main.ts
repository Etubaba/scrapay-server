import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { hostname } from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('cors.origin'),
    methods: configService.get('cors.methods'),
  });

  const port = configService.get<number>('app.port');

  await app.listen(port, '0.0.0.0', () => {
    console.log(`Listening at port ${port}`);
  });
}
bootstrap();
