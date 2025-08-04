import { Size } from "./Size";
import { Point } from "./Point";
export declare class Frame {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    scaleDown(scale: number): Frame;
    bottom(): number;
    size(): Size;
    static withSize(width: number, height: number): Frame;
    static empty(): Frame;
    static fromRect(rect: DOMRect): Frame;
    static fromPoint(point: Point, size: number): Frame;
    static fromDOMRect(rect: DOMRect): Frame;
}
