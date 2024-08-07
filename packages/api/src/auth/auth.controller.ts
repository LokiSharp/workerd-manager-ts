import { Request, Controller, Post, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './auth.decorator';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { AuthRefreshTokenService } from './auth-refresh-token.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService, 
        private authRefreshTokenService: AuthRefreshTokenService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req): unknown {
        return this.authService.login(req.user);
    }

    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    @Post('refresh-tokens')
    refreshTokens(@Request() req): unknown {
        if (!req.user) {
            throw new InternalServerErrorException();
        }
        return this.authRefreshTokenService.generateTokenPair(
            req.user.userId,
            req.headers.authorization?.split(' ')[1],
            req.user.refreshTokenExpiresAt,
        );
    }
}
