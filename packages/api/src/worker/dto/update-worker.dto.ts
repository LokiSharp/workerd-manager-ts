import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { AdditionalWorkerInfo, CreateWorkerDto } from './create-worker.dto';

export class UpdateWorkerDto extends PartialType(IntersectionType(OmitType(CreateWorkerDto, ['userId'] as const), AdditionalWorkerInfo)) { }
