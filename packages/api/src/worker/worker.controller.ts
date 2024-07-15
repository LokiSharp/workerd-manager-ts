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
    findAll() {
        return this.workerService.findWorkers({});
    }

    @Get('/:id')
    findOne(@Param('id') id: string) {
        return this.workerService.findWorker({ id });
    }

    @Delete('/:id')
    remove(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.removeWorker({ id });
    }

    @Post('/:id/file')
    updateFile(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.updateFile({ id });
    }

    @Delete('/:id/file')
    deleteFile(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.deleteFile({ id });
    }

    @Post('/:id/run')
    runWorker(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.runWorker({ id });
    }

    @Delete('/:id/run')
    stopWorker(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.stopWorker({ id });
    }
}
