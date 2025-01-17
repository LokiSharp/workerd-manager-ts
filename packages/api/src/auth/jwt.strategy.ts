import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: string, username: string, roles: string[] }): Promise<unknown> {
        const authUser = await this.usersService.findOne({ id: payload.sub });
        if (!authUser) {
            throw new UnauthorizedException();
        }
        return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }
}
