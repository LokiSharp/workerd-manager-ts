import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { WorkerModule } from './worker/worker.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [WorkerModule, UserModule, ConfigModule.forRoot()],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
