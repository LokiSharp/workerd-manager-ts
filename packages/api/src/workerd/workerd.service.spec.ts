import { Test, TestingModule } from '@nestjs/testing';
import { WorkerdService } from './workerd.service';

describe('WorkerdService', () => {
  let service: WorkerdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkerdService],
    }).compile();

    service = module.get<WorkerdService>(WorkerdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
