export const appConfigInstance = {
    WorkerdDir: typeof process.env.WORKERD_DIR === 'string' ? process.env.WORKERD_DIR : '/workerd',
    WorkerdBinPath: typeof process.env.WORKERD_BIN_PATH === 'string' ? process.env.WORKERD_BIN_PATH : '/bin/workerd',
    WorkerInfoDir: typeof process.env.WORKER_INFO_DIR === 'string' ? process.env.WORKER_INFO_DIR : 'worker-info',
    WorkerCodeDir: typeof process.env.WORKER_CODE_DIR === 'string' ? process.env.WORKER_CODE_DIR : 'src',
    DBPath: typeof process.env.DB_PATH === 'string' ? process.env.DB_PATH : '/workerd/db.sqlite',
    DBType: typeof process.env.DB_TYPE === 'string' ? process.env.DB_TYPE : 'sqlite',
    APIListenAddress: typeof process.env.LISTEN_ADDR === 'string' ? process.env.LISTEN_ADDR : '0.0.0.0',
    APIPort: typeof process.env.API_PORT === 'number' ? process.env.API_PORT : 8888,
};
