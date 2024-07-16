import { writeFileSync, existsSync, mkdirSync, WriteFileOptions } from 'fs';
import path from 'path';

export function ensureDirectoryExistence(directoryPath: string): void {
    if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath, { recursive: true });
    }
}

export function writeFileSyncRecursive(filePath: string, data: string | Buffer | Uint8Array, options?: WriteFileOptions): void {
    const directoryPath = path.dirname(filePath);
    ensureDirectoryExistence(directoryPath);
    writeFileSync(filePath, data, options);
}
