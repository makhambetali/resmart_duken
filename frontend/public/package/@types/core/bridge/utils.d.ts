export declare function gatherTransferables(args: any, useCopy?: boolean): Transferable[];
export declare function isRemote(path: string): boolean;
export declare function areThreadsAvailable(): boolean;
export declare function getBuildType(options: {
    allowSimd?: boolean;
    allowThreads?: boolean;
}): string;
