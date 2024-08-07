import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<unknown> {
        const user = await this.usersService.findOne({ userName: username });

        if (!user || !await bcrypt.compare(pass, user.password)) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async login(user: User) {
        const payload = { sub: user.id, username: user.userName, roles: user.roles };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}
