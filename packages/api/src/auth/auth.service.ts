import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async signIn(email: string, pass: string): Promise<unknown> {
        const user = await this.usersService.findOne({ email });

        if (!user || !await bcrypt.compare(pass, user.password)) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.userName };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
