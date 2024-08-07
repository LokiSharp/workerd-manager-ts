import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import fastifyCors from '@fastify/cors';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    );
    const configService = app.get(ConfigService);
    await app.register(helmet)
    await app.register(fastifyCsrf);
    await app.register(fastifyCors, {
        origin: '*'
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(configService.get('API_PORT'), configService.get('API_LISTEN_ADDR'));
}
bootstrap();
