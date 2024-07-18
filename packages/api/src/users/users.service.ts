import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        const data: Prisma.UserCreateInput = {
            email: createUserDto.email,
            userName: createUserDto.userName,
            password: hashedPassword,
        };
        return this.prisma.user.create({ data });
    }

    async validateUser(email: string, pass: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && await bcrypt.compare(pass, user.password)) {
            return true;
        } else {
            return false;
        }
    }

    findAll(
        params: {
            skip?: number;
            take?: number;
            cursor?: Prisma.UserWhereUniqueInput;
            where?: Prisma.UserWhereInput;
            orderBy?: Prisma.UserOrderByWithRelationInput;
        }
    ): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    findOne(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return await this.prisma.user.update({ where: { id }, data: updateUserDto });
    }

    remove(id: string) {
        return this.prisma.user.delete({ where: { id } });
    }
}
