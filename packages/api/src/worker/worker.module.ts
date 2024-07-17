import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { PrismaService } from '@/prisma.service';
import { WorkerdService } from '@/workerd/workerd.service';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [WorkerController],
    providers: [WorkerService, PrismaService, WorkerdService, ConfigService],
    exports: [WorkerService],
})
export class WorkerModule { }
