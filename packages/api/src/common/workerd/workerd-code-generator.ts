import { Worker } from '@/gen/wokerd_pb';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { writeFileSyncRecursive } from '../utils';
import { rmdirSync } from 'fs';

const configService = new ConfigService();

export function updateFile(worker: Worker): Error | undefined {
    if (!worker || !worker.id) {
        return new Error('Invalid worker');
    }
    worker.id = worker.id.replace(/-/g, '');
    try {
        writeFileSyncRecursive(
            join(
                configService.get('WORKERD_DIR'),
                configService.get('WORKER_INFO_DIR'),
                worker.id,
                configService.get('WORKER_CODE_DIR'),
                worker.entry
            ),
            worker.code
        );
    } catch (err) {
        return err as Error;
    }
}

export function deleteFile(worker: Worker): Error | undefined {
    if (!worker || !worker.id) {
        return new Error('Invalid worker');
    }
    worker.id = worker.id.replace(/-/g, '');
    try {
        rmdirSync(
            join(
                configService.get('WORKERD_DIR'),
                configService.get('WORKER_INFO_DIR'),
                worker.id,
            ),
            { recursive: true }
        );
    } catch (err) {
        return err as Error;
    }
}
