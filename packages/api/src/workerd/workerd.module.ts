import { Module } from '@nestjs/common';
import { WorkerdService } from './workerd.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [WorkerdService, ConfigService]
})
export class WorkerdModule {}
