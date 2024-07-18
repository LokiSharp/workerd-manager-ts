import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Worker as WorkerModel, Prisma } from '@prisma/client';
import { Worker } from '@/gen/wokerd_pb';
import { WorkerdService } from '@/workerd/workerd.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Injectable()
export class WorkerService {
    constructor(private prisma: PrismaService, private workerd: WorkerdService) { }

    async create(createWorkerDto: CreateWorkerDto): Promise<WorkerModel> {
        const data: Prisma.WorkerCreateInput = {
            port: createWorkerDto.port,
            code: createWorkerDto.code,
            name: createWorkerDto.name,
            user: { connect: { id: createWorkerDto.userId } }
        }
        return this.prisma.worker.create({ data });
    }

    async update(id: string, updateWorkerDto: UpdateWorkerDto): Promise<WorkerModel> {
        return this.prisma.worker.update({ where: { id }, data: updateWorkerDto });
    }

    async findOne(id: string): Promise<WorkerModel | null> {
        return this.prisma.worker.findUnique({ where: { id } });
    }

    async findAll(
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

    async remove(id: string): Promise<WorkerModel> {
        return this.prisma.worker.delete({ where: { id } });
    }

    async writeWorkerConfigCapfile(id: string): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where: { id } }));
        return this.workerd.writeWorkerConfigCapfile(configData);
    }

    async writeCode(id: string): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where: { id } }));
        return this.workerd.writeWorkerCode(configData);
    }

    async deleteFile(id: string): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where: { id } }));
        return this.workerd.deleteFile(configData);
    }

    async run(id: string): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where: { id } }));
        return this.workerd.runCmd(configData.id, []);
    }

    async stop(id: string): Promise<Error | undefined> {
        const configData = new Worker(await this.prisma.worker.findUnique({ where: { id } }));
        return this.workerd.exitCmd(configData.id);
    }

    async stopAllWorkers(): Promise<Error | undefined> {
        return this.workerd.exitAllCmd();
    }
}
