import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import utils from '@workerd-manager/utils';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(utils.appConfigInstance.APIPort, utils.appConfigInstance.APIListenAddress);
}
bootstrap();
