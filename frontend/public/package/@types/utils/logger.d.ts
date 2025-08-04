export default class Logger {
    private static verbose;
    static initialize(verbose?: boolean): void;
    static debug(message: string): void;
    static debugWarn(message: string): void;
}
