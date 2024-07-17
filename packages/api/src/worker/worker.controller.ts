import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Worker as WorkerModel, Prisma } from '@prisma/client';
import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) { }
    @Post()
    async create(@Body() workerData: Prisma.WorkerCreateInput): Promise<WorkerModel> {
        const worker = await this.workerService.createWorker(workerData)
        return worker;
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() workerData: Prisma.WorkerUpdateInput): Promise<WorkerModel> {
        const worker = await this.workerService.updateWorker({
            where: { id },
            data: workerData,
        });
        return worker;
    }

    @Get()
    async findAll(): Promise<WorkerModel[]> {
        return this.workerService.findWorkers({});
    }

    @Get('/:id')
    async findOne(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.findWorker({ id });
    }

    @Delete('/:id')
    async remove(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.removeWorker({ id });
    }

    @Post('/:id/config')
    async writeWorkerConfigCapfile(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.writeWorkerConfigCapfile({ id });
    }

    @Post('/:id/code')
    async writeWorkerCode(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.writeWorkerCode({ id });
    }

    @Delete('/:id/file')
    async deleteFile(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.deleteFile({ id });
    }

    @Post('/:id/run')
    async runWorker(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.runWorker({ id });
    }

    @Delete('/:id/run')
    async stopWorker(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.stopWorker({ id });
    }
}
