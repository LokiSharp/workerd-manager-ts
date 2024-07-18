import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { WorkerdModule } from './workerd/workerd.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [ConfigModule.forRoot(), UsersModule, WorkerModule, WorkerdModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
