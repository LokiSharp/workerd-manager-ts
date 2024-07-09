import { compile } from 'handlebars';
import { createHash } from 'crypto';
import { Worker } from '@/gen/wokerd_pb';
import { writeFileSync, existsSync, mkdirSync, WriteFileOptions } from 'fs';
import path, { join } from 'path';
import { DefaultTemplate } from '@/const';
import { appConfigInstance } from '@/env-conf';

const templateCache: { [key: string]: (data: Worker) => string } = {};

export function generateWorkerConfigs(workers: Worker[]): { [key: string]: string } {
    if (workers.length === 0) {
        return {};
    }
    const results: { [key: string]: string } = {};
    for (const worker of workers) {
        results[worker.UID] = generateWorkerConfig(worker);
    }
    return results;
}

export function generateWorkerConfig(worker: Worker): string {
    const template = worker.Template || DefaultTemplate;
    const templateHash = getTemplateHash(template);
    const compiledTemplate = templateCache[templateHash] || compile(template);
    if (!templateCache[templateHash]) {
        templateCache[templateHash] = compiledTemplate;
    }
    return compiledTemplate(worker);
}


export function generateWorkerConfigCapfile(worker: Worker): Error | undefined {
    if (!worker || !worker.UID) {
        return new Error('Invalid worker');
    }

    const fileMap = generateWorkerConfigs([worker]);
    const fileContent = fileMap[worker.UID];
    if (!fileContent) {
        return new Error('Error building Capfile');
    }
    console.log(appConfigInstance.WorkerdDir);
    try {
        writeFileSyncRecursive(
            join(
                appConfigInstance.WorkerdDir,
                'worker-info',
                worker.UID,
                'Capfile'
            ),
            fileContent
        );
    } catch (err) {
        return err as Error;
    }
}

function getTemplateHash(template: string): string {
    return createHash('sha256').update(template).digest('hex');
}

function ensureDirectoryExistence(directoryPath: string): void {
    if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath, { recursive: true });
    }
}

function writeFileSyncRecursive(filePath: string, data: string | Buffer | Uint8Array, options?: WriteFileOptions): void {
    const directoryPath = path.dirname(filePath);
    ensureDirectoryExistence(directoryPath);
    writeFileSync(filePath, data, options);
}
