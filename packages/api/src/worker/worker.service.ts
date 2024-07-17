import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Worker as WorkerModel, Prisma } from '@prisma/client';
import { Worker } from '@/gen/wokerd_pb';
import { WorkerdService } from '@/workerd/workerd.service';

@Injectable()
export class WorkerService {
    constructor(private prisma: PrismaService, private workerd: WorkerdService) { }

    async createWorker(data: Prisma.WorkerCreateInput): Promise<WorkerModel> {
        return this.prisma.worker.create({ data });
    }

    async updateWorker(params: {
        where: Prisma.WorkerWhereUniqueInput;
        data: Prisma.WorkerUpdateInput;
    }): Promise<WorkerModel> {
        const { where, data } = params;
        return this.prisma.worker.update({ data, where });
    }

    async findWorker(where: Prisma.WorkerWhereUniqueInput): Promise<WorkerModel | null> {
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
    ): Promise<WorkerModel[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.worker.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async removeWorker(where: Prisma.WorkerWhereUniqueInput): Promise<WorkerModel> {
        return this.prisma.worker.delete({ where });
    }

    async writeWorkerConfigCapfile(where: Prisma.WorkerWhereUniqueInput): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        return this.workerd.writeWorkerConfigCapfile(configData);
    }

    async writeWorkerCode(where: Prisma.WorkerWhereUniqueInput): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        return this.workerd.writeWorkerCode(configData);
    }

    async deleteFile(where: Prisma.WorkerWhereUniqueInput): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        return this.workerd.deleteFile(configData);
    }

    async runWorker(where: Prisma.WorkerWhereUniqueInput): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        return this.workerd.runCmd(configData.id, []);
    }

    async stopWorker(where: Prisma.WorkerWhereUniqueInput): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        return this.workerd.exitCmd(configData.id);
    }

    async stopAllWorkers(): Promise<Error | undefined> {
        return this.workerd.exitAllCmd();
    }
}
