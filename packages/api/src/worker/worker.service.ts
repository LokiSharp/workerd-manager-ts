import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Worker as WorkerModel, Prisma } from '@prisma/client';
import { workerGenerator, Worker, workerdCodeGenerator } from '@workerd-manager/common'

@Injectable()
export class WorkerService {
    constructor(private prisma: PrismaService) { }

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

    generateWorkerdConfig(worker: WorkerModel) {
        const configData = new Worker(worker);
        workerGenerator.generateWorkerConfigCapfile(configData);
    }

    async updateFile(where: Prisma.WorkerWhereUniqueInput): Promise<WorkerModel> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        this.generateWorkerdConfig(configData);
        workerdCodeGenerator.updateFile(configData);
        return configData;
    }

    async deleteFile(where: Prisma.WorkerWhereUniqueInput): Promise<WorkerModel> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        workerdCodeGenerator.deleteFile(configData);
        return configData;
    }
}
