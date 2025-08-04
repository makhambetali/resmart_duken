type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
};
export declare function colorToRGBA(color: string): RGBA | null;
export declare function isColorTransparent(color: string): boolean;
export {};
