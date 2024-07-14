import { Test, TestingModule } from '@nestjs/testing';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { PrismaService } from '@/prisma.service';

describe('WorkerController', () => {
    let controller: WorkerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WorkerService, PrismaService],
            controllers: [WorkerController],
        }).compile();

        controller = module.get<WorkerController>(WorkerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
