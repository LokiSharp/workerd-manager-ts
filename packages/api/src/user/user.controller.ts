import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User as UserModel, Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) { }
    @Post()
    async create(@Body() UserData: Prisma.UserCreateInput): Promise<UserModel> {
        return this.UserService.createUser(UserData);
    }

    @Put('/:id')
    update(@Param('id') id: string, @Body() UserData: Prisma.UserUpdateInput): Promise<UserModel> {
        return this.UserService.updateUser({
            where: { id },
            data: UserData,
        });
    }

    @Get()
    findAll() {
        return this.UserService.findUsers({});
    }

    @Get('/:id')
    findOne(@Param('id') id: string) {
        return this.UserService.findUser({ id });
    }

    @Delete('/:id')
    remove(@Param('id') id: string): Promise<UserModel> {
        return this.UserService.removeUser({ id });
    }
}
