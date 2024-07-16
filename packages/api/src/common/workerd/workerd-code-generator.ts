import { Worker } from '@/gen/wokerd_pb';
import { join } from 'path';
import { appConfigInstance } from '../env-conf';
import { writeFileSyncRecursive } from '../utils';
import { rmdirSync } from 'fs';

export function updateFile(worker: Worker): Error | undefined {
    if (!worker || !worker.id) {
        return new Error('Invalid worker');
    }
    worker.id = worker.id.replace(/-/g, '');
    try {
        writeFileSyncRecursive(
            join(
                appConfigInstance.WorkerdDir,
                appConfigInstance.WorkerInfoDir,
                worker.id,
                appConfigInstance.WorkerCodeDir,
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
                appConfigInstance.WorkerdDir,
                appConfigInstance.WorkerInfoDir,
                worker.id,
            ),
            { recursive: true }
        );
    } catch (err) {
        return err as Error;
    }
}
