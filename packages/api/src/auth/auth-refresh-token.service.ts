import { PrismaService } from "@/prisma.service";
import { UsersService } from "@/users/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Prisma } from "@prisma/client";

@Injectable()
export class AuthRefreshTokenService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
        private usersService: UsersService,
    ) { }

    async generateRefreshToken(
        authUserId: string,
        currentRefreshToken?: string,
        currentRefreshTokenExpiresAt?: Date,
    ) {
        const newRefreshToken = this.jwtService.sign(
            { sub: authUserId },
            {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '30d',
            },
        );

        if (currentRefreshToken && currentRefreshTokenExpiresAt) {
            if (
                await this.isRefreshTokenBlackListed(currentRefreshToken, authUserId)
            ) {
                throw new UnauthorizedException('Invalid refresh token.');
            }

            const data: Prisma.AuthRefreshTokenUncheckedCreateInput = {
                refreshToken: currentRefreshToken,
                expiresAt: currentRefreshTokenExpiresAt,
                userId: authUserId,
            };
            await this.prisma.authRefreshToken.create({ data });
        }

        return newRefreshToken;
    }

    private async isRefreshTokenBlackListed(refreshToken: string, userId: string) {
        return await this.prisma.authRefreshToken.findFirst({
            where: {
                refreshToken,
                userId,
            },
        });
    }


    async generateTokenPair(
        userId: string,
        currentRefreshToken?: string,
        currentRefreshTokenExpiresAt?: Date,
    ) {
        const user = await this.usersService.findOne({ id: userId });
        if (!user) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.userName, roles: user.roles };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: await this.generateRefreshToken(
                user.id,
                currentRefreshToken,
                currentRefreshTokenExpiresAt,
            ),
        };
    }

    @Cron(CronExpression.EVERY_DAY_AT_6AM)
    async clearExpiredRefreshTokens() {
        await this.prisma.authRefreshToken.deleteMany({
            where: {
                expiresAt: {
                    lte: new Date(),
                },
            },
        });
    }
}
