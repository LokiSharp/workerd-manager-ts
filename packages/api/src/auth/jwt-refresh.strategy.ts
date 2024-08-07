import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private usersService: UsersService, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_REFRESH_SECRET'),
        });
    }

    async validate(payload: { sub: string, exp: number }): Promise<unknown> {
        const authUser = await this.usersService.findOne({ id: payload.sub });
        if (!authUser) {
            throw new UnauthorizedException();
        }
        return { userId: payload.sub, refreshTokenExpiresAt: new Date(payload.exp * 1000) };
    }
}
