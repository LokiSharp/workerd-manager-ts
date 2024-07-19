import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { PrismaService } from '@/prisma.service';
import { WorkerdService } from '@/workerd/workerd.service';

@Module({
    controllers: [WorkerController],
    providers: [WorkerService, PrismaService, WorkerdService],
    exports: [WorkerService],
})
export class WorkerModule { }
