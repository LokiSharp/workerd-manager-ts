import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: new ConfigService().get('JWT_SECRET'),
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, {
        provide: APP_GUARD,
        useClass: AuthGuard,
    },]
})
export class AuthModule { }