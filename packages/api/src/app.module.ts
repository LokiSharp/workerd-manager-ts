import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { WorkerdModule } from './workerd/workerd.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        WorkerModule,
        WorkerdModule,
        AuthModule,
        RolesModule,
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,
                limit: 5,
            },
            {
                name: 'medium',
                ttl: 10000,
                limit: 20
            },
            {
                name: 'long',
                ttl: 60000,
                limit: 100
            }
        ]),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }

    ],
})
export class AppModule { }
