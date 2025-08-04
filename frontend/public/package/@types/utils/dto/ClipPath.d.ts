import { Frame } from "./Frame";
export declare class ClipPath {
    left: string;
    top: string;
    right: string;
    bottom: string;
    private static toPx;
    static toNumber(existing: string): number;
    static fromFrames(container: Frame, view: Frame): ClipPath;
    static subtractHalf(existing: string, subtraction: number): string;
    static subtract(existing: string, subtraction: number): string;
    static addHalf(existing: string, addition: number): string;
    static add(existing: string, addition: number): string;
}
