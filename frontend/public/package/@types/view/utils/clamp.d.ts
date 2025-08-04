import { Size } from "../../utils/dto/Size";
import { Point } from "../../utils/dto/Point";
export declare function clamp(value: number, min: number, max: number): number;
export declare function clampHandlePosition(handlePosition: Point, handleDiameter: number, containerSize: Size): Point;
