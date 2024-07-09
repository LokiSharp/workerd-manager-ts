export const appConfigInstance = {
    WorkerdDir: typeof process.env.WORKERD_DIR === 'string' ? process.env.WORKERD_DIR : '/workerd',
    WorkerdBinPath: typeof process.env.WORKERD_BIN_PATH === 'string' ? process.env.WORKERD_BIN_PATH : '/bin/workerd',
};
