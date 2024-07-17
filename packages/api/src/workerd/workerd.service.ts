import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker } from '@/gen/wokerd_pb';
import { writeFileSyncRecursive } from '../common/utils';
import { DefaultTemplate } from '../common/const';
import { join } from 'path';
import { rmSync } from 'fs';
import { createHash } from 'crypto';
import { compile } from 'handlebars';
import { ChildProcess, spawn } from 'child_process';



@Injectable()
export class WorkerdService {
    constructor(private configService: ConfigService) { }
    private templateCache: { [key: string]: (data: Worker) => string } = {};

    private signMap = new Map<string, boolean>();
    private chanMap = new Map<string, AbortController>();
    private childMap = new Map<string, ChildProcess>();

    writeWorkerCode(worker: Worker): Error | undefined {
        if (!worker || !worker.id) {
            return new Error('Invalid worker');
        }
        worker.id = worker.id.replace(/-/g, '');
        try {
            writeFileSyncRecursive(
                join(
                    this.configService.get('WORKERD_DIR'),
                    this.configService.get('WORKER_INFO_DIR'),
                    worker.id,
                    "src",
                    worker.entry
                ),
                worker.code
            );
        } catch (err) {
            return err as Error;
        }
    }

    deleteFile(worker: Worker): Error | undefined {
        if (!worker || !worker.id) {
            return new Error('Invalid worker');
        }
        worker.id = worker.id.replace(/-/g, '');
        try {
            rmSync(
                join(
                    this.configService.get('WORKERD_DIR'),
                    this.configService.get('WORKER_INFO_DIR'),
                    worker.id,
                ),
                { recursive: true }
            );
        } catch (err) {
            return err as Error;
        }
    }

    generateWorkerConfigs(workers: Worker[]): { [key: string]: string } {
        if (workers.length === 0) {
            return {};
        }
        const results: { [key: string]: string } = {};
        for (const worker of workers) {
            results[worker.id] = this.generateWorkerConfig(worker);
        }
        return results;
    }

    generateWorkerConfig(worker: Worker): string {
        worker.id = worker.id.replace(/-/g, '');
        const template = worker.template || DefaultTemplate;
        const templateHash = getTemplateHash(template);
        const compiledTemplate = this.templateCache[templateHash] || compile(template);
        if (!this.templateCache[templateHash]) {
            this.templateCache[templateHash] = compiledTemplate;
        }
        return compiledTemplate(worker);
    }

    writeWorkerConfigCapfile(worker: Worker): Error | undefined {
        if (!worker || !worker.id) {
            return new Error('Invalid worker');
        }
        worker.id = worker.id.replace(/-/g, '');
        const fileMap = this.generateWorkerConfigs([worker]);
        const fileContent = fileMap[worker.id];
        if (!fileContent) {
            return new Error('Error building Capfile');
        }
        try {
            writeFileSyncRecursive(
                join(
                    this.configService.get('WORKERD_DIR'),
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

    runCmd(id: string, argv: string[]): Error | undefined {
        id = id.replace(/-/g, '');
        if (this.chanMap.has(id)) {
            console.warn(`[WorkerdRunner] ${id} is running, skip this time.`);
            return;
        }

        const controller = new AbortController();
        this.chanMap.set(id, controller);

        try {
            const run = async () => {
                this.signMap.delete(id);
                console.warn(`[WorkerdRunner] ${id} start running...`);

                const workerDir = join(
                    this.configService.get('WORKERD_DIR'),
                    'worker-info',
                    id
                )

                const args = ['serve', join(workerDir, 'Capfile'), '--watch', '--verbose', ...argv];
                const cmd = "workerd";
                const child = spawn(cmd, args);

                child.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });

                child.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });

                child.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                });

                child.on('error', (err) => {
                    console.error(`Failed to start subprocess. ${err.message}`);
                });

                console.log(`Run Child PID: ${child!.pid}`);

                this.childMap.set(id, child);

                if (this.signMap.get(id)) {
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            run().catch(err => console.error(`Run error: ${err.message}`));
        } catch (err) {
            return err as Error;
        }
    }

    exitCmd(id: string): Error | undefined {
        try {
            id = id.replace(/-/g, '')
            const controller = this.chanMap.get(id);
            const cancel = async () => {
                console.warn(`[WorkerdRunner] ${id} stopping...`);
                if (this.chanMap.has(id)) {
                    controller!.abort();
                    const child = this.childMap.get(id);
                    child?.kill();
                    console.log(`Kill Child PID: ${child!.pid}`);
                    this.signMap.set(id, true);
                    this.chanMap.delete(id);
                } else {
                    console.error(`workerd ${id} is not running!`);
                }
            };
            cancel().catch(err => console.error(`Cancel error: ${err.message}`));
        } catch (err) {
            return err as Error;
        }
    }

    exitAllCmd(): Error | undefined {
        try {
            for (const id of this.chanMap.keys()) {
                this.exitCmd(id);
            }
        } catch (err) {
            return err as Error;
        }
    }
}

function getTemplateHash(template: string): string {
    return createHash('sha256').update(template).digest('hex');
}