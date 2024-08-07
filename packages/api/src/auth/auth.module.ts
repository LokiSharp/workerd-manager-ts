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
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { PrismaService } from '@/prisma.service';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: new ConfigService().get('JWT_SECRET'),
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthRefreshTokenService, PrismaService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },]
})
export class AuthModule { }
