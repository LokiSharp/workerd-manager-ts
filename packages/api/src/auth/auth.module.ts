import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        UsersModule, 
        PassportModule,
        JwtModule.register({
            global: true,
            secret: new ConfigService().get('JWT_SECRET'),
            signOptions: { expiresIn: '7604800s' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },]
})
export class AuthModule { }
