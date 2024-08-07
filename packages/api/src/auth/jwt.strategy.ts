import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: new ConfigService().get('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: string, username: string, roles: string[] }): Promise<{ userId: string, username: string, roles: string[] }> {
        return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }
}
