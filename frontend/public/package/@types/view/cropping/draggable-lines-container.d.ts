import React from "react";
import { Point } from "../../utils/dto/Point";
import { DraggableBaseContainer } from "./draggable-base-container";
export declare class DraggableLinesContainer extends DraggableBaseContainer {
    point1Offset: Point;
    point2Offset: Point;
    point0Start: Readonly<Point>;
    point1Start: Readonly<Point>;
    point2Start: Readonly<Point>;
    point3Start: Readonly<Point>;
    create(): React.JSX.Element[];
    lineTouchStart(e: React.PointerEvent<HTMLDivElement>, index: number): void;
    lineTouchMove(e: React.PointerEvent<HTMLDivElement>, index: number): void;
    lineTouchEnd(e: React.PointerEvent<HTMLDivElement>): void;
    isNearOpposingPoint(start: Point, active: Point, wall: Point, axis: "x" | "y"): boolean;
    areEdgesCrossing(edgeAPoint1: Point, edgeAPoint2: Point, edgeBPoint1: Point, edgeBPoint2: Point): boolean;
    render(): React.JSX.Element;
}
