import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkerDto {
    @IsNumber()
    readonly port: number;
    @IsString()
    readonly code: string;
    @IsString()
    readonly name: string;
    @IsString()
    @IsNotEmpty()
    readonly userId: string;
}

export class AdditionalWorkerInfo {
    @IsString()
    readonly externalPath: string;
    @IsString()
    readonly hostName: string;
    @IsString()
    readonly nodeName: string;
    @IsString()
    readonly entry: string;
    @IsString()
    readonly tunnelId: string;
    @IsString()
    readonly template: string;
}
