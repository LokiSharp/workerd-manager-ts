import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthRefreshTokenService } from './auth-refresh-token.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private authRefreshTokenService: AuthRefreshTokenService,
    ) { }

    async validateUser(username: string, pass: string): Promise<unknown> {
        const user = await this.usersService.findOne({ userName: username });

        if (!user || !await bcrypt.compare(pass, user.password)) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async login(user: User) {
        return this.authRefreshTokenService.generateTokenPair(user.id);
    }
}
