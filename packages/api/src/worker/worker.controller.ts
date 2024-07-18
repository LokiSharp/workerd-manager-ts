import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Worker as WorkerModel } from '@prisma/client';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Controller('worker')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) { }
    @Post()
    async create(@Body() createWorkerDto: CreateWorkerDto): Promise<WorkerModel> {
        return await this.workerService.create(createWorkerDto);
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto): Promise<WorkerModel> {
        return await this.workerService.update(id, updateWorkerDto);
    }

    @Get()
    async findAll(): Promise<WorkerModel[]> {
        return this.workerService.findAll({});
    }

    @Get('/:id')
    async findOne(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.findOne(id);
    }

    @Delete('/:id')
    async remove(@Param('id') id: string): Promise<WorkerModel> {
        return this.workerService.remove(id);
    }

    @Post('/:id/config')
    async writeWorkerConfigCapfile(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.writeWorkerConfigCapfile(id);
    }

    @Post('/:id/code')
    async writeCode(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.writeCode(id);
    }

    @Delete('/:id/file')
    async deleteFile(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.deleteFile(id);
    }

    @Post('/:id/run')
    async run(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.run(id);
    }

    @Delete('/:id/run')
    async stop(@Param('id') id: string): Promise<Error | undefined> {
        return this.workerService.stop(id);
    }
}
