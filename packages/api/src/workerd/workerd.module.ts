import { Module } from '@nestjs/common';
import { WorkerdService } from './workerd.service';

@Module({
  providers: [WorkerdService]
})
export class WorkerdModule {}
