import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Worker, Prisma } from '@prisma/client';

@Injectable()
export class WorkerService {
    constructor(private prisma: PrismaService) { }

    async createWorker(data: Prisma.WorkerCreateInput): Promise<Worker> {
        return this.prisma.worker.create({ data });
    }

    async updateWorker(params: {
        where: Prisma.WorkerWhereUniqueInput;
        data: Prisma.WorkerUpdateInput;
    }): Promise<Worker> {
        const { where, data } = params;
        return this.prisma.worker.update({ data, where });
    }

    async findWorker(where: Prisma.WorkerWhereUniqueInput): Promise<Worker | null> {
        return this.prisma.worker.findUnique({ where });
    }

    async findWorkers(
        params: {
            skip?: number;
            take?: number;
            cursor?: Prisma.WorkerWhereUniqueInput;
            where?: Prisma.WorkerWhereInput;
            orderBy?: Prisma.WorkerOrderByWithRelationInput;
        }
    ): Promise<Worker[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.worker.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async removeWorker(where: Prisma.WorkerWhereUniqueInput): Promise<Worker> {
        return this.prisma.worker.delete({ where });
    }
}
