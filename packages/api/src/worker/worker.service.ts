import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Worker as WorkerModel, Prisma } from '@prisma/client';
import { WorkerdRunner, workerGenerator, Worker, workerdCodeGenerator } from '@/common'

@Injectable()
export class WorkerService {
    public runner = new WorkerdRunner();
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

    async runWorker(where: Prisma.WorkerWhereUniqueInput): Promise<WorkerModel> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        this.runner.runCmd(configData.id, []);
        return configData;
    }

    async stopWorker(where: Prisma.WorkerWhereUniqueInput): Promise<WorkerModel> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where }));
        this.runner.exitCmd(configData.id);
        return configData;
    }

    async stopAllWorkers() {
        this.runner.exitAllCmd();
    }
}
