import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import common from '@workerd-manager/common';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(common.appConfigInstance.APIPort, common.appConfigInstance.APIListenAddress);
}
bootstrap();
