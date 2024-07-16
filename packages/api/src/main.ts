import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { appConfigInstance } from '@/common';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(appConfigInstance.APIPort, appConfigInstance.APIListenAddress);
}
bootstrap();
