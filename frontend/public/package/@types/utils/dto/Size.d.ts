import { Point } from "./Point";
export declare class Size {
    width: number;
    height: number;
    constructor(width: number, height: number);
    isPortrait(): boolean;
    ratio(heightBased?: boolean): number;
    ratioDiff(other: Size, heightBased?: boolean): number;
    static isEmpty(size: Size): boolean;
    static toPolygon(size: Size): Point[];
    static fromHtmlElement(element: HTMLElement): Size;
    static fromJson(json: {
        width: number;
        height: number;
    }): Size;
    static subtractFrom(original: Size, amount: number): Size;
    static empty(): Size;
}
