export declare class Utils {
    static toPixelSize(size: number): string;
    static containsString(content: string, substring: string): boolean;
    static copy(item: any): any;
    static getProperty<T>(obj: T, propertyName: keyof T): T[keyof T] | undefined;
    static uuid(): string;
}
