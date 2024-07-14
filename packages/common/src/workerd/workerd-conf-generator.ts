import { compile } from 'handlebars';
import { createHash } from 'crypto';
import { Worker } from '@/gen/wokerd_pb';
import { join } from 'path';
import { DefaultTemplate } from '@/const';
import { appConfigInstance } from '@/env-conf';
import { writeFileSyncRecursive } from '@/utils';

const templateCache: { [key: string]: (data: Worker) => string } = {};

export function generateWorkerConfigs(workers: Worker[]): { [key: string]: string } {
    if (workers.length === 0) {
        return {};
    }
    const results: { [key: string]: string } = {};
    for (const worker of workers) {
        results[worker.id] = generateWorkerConfig(worker);
    }
    return results;
}

export function generateWorkerConfig(worker: Worker): string {
    worker.id = worker.id.replace(/-/g, '');
    const template = worker.template || DefaultTemplate;
    const templateHash = getTemplateHash(template);
    const compiledTemplate = templateCache[templateHash] || compile(template);
    if (!templateCache[templateHash]) {
        templateCache[templateHash] = compiledTemplate;
    }
    return compiledTemplate(worker);
}


export function generateWorkerConfigCapfile(worker: Worker): Error | undefined {
    if (!worker || !worker.id) {
        return new Error('Invalid worker');
    }
    worker.id = worker.id.replace(/-/g, '');
    const fileMap = generateWorkerConfigs([worker]);
    const fileContent = fileMap[worker.id];
    if (!fileContent) {
        return new Error('Error building Capfile');
    }
    try {
        writeFileSyncRecursive(
            join(
                appConfigInstance.WorkerdDir,
                'worker-info',
                worker.id,
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
