import { join } from 'path';
import { appConfigInstance } from '../env-conf';
import { ChildProcess, spawn } from 'child_process';

export class WorkerdRunner {
    private signMap = new Map<string, boolean>();
    private chanMap = new Map<string, AbortController>();
    private childMap = new Map<string, ChildProcess>();

    public runCmd(id: string, argv: string[]) {
        id = id.replace(/-/g, '');
        if (this.chanMap.has(id)) {
            console.warn(`[WorkerdRunner] ${id} is running, skip this time.`);
            return;
        }

        const controller = new AbortController();
        this.chanMap.set(id, controller);

        const run = async () => {
            this.signMap.delete(id);
            console.warn(`[WorkerdRunner] ${id} start running...`);

            const workerDir = join(
                appConfigInstance.WorkerdDir,
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
    }

    public exitCmd(id: string) {
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
    }

    public exitAllCmd() {
        for (const id of this.chanMap.keys()) {
            this.exitCmd(id);
        }
    }
}
