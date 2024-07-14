import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Worker as WorkerModel, Prisma } from '@prisma/client';
import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) { }
    @Post()
    async create(@Body() workerData: Prisma.WorkerCreateInput): Promise<WorkerModel> {
        return this.workerService.createWorker(workerData);
    }

    @Put('/:id')
    update(@Param('id') id: string, @Body() workerData: Prisma.WorkerUpdateInput): Promise<WorkerModel> {
        return this.workerService.updateWorker({
            where: { id },
            data: workerData,
        });
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
}
