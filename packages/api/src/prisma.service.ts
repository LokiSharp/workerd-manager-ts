import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({ log: ['query', 'info', 'warn', 'error'] });
        this.$use(async (params, next) => {
            const before = Date.now();
            const result = await next(params);
            const after = Date.now();
            console.log(
                `Query ${params.model}.${params.action} took ${after - before}ms`,
            );
            return this.serialize(result);
        });
    }

    serialize(obj: null) {
        if (typeof obj === 'bigint') {
            return parseInt(`${obj}`);
        } else if (typeof obj === 'object' && obj !== null) {
            return JSON.parse(
                JSON.stringify(obj, (key, value) => {
                    if (typeof value === 'bigint') {
                        return parseInt(`${value}`);
                    }
                    return value;
                }),
            );
        }
        return obj;
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
