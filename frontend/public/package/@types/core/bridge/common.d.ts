export declare class PartiallyConstructible {
    /** @internal */
    _marker(): void;
}
export type DeepPartial<T> = T extends PartiallyConstructible ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T extends Array<infer I> ? DeepPartial<I>[] : T;
export type RawImage = {
    width: number;
    height: number;
    data: Uint8Array;
    format: "BGR" | "BGRA" | "GRAY";
    step: number;
};
export interface Point {
    x: number;
    y: number;
}
export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
