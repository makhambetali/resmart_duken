import React, { CSSProperties } from "react";
import { Point } from "../../utils/dto/Point";
import { Size } from "../../utils/dto/Size";
import { CroppingViewPolygonHandleStyle } from "../../model/configuration/cropping-view-configuration";
export interface MovingLine {
    points: {
        index: number;
        coordinates: Point;
    }[];
    /** The point of the polygon that is clockwise before the moving line */
    previousPoint: Point;
    /** The point of the polygon that is clockwise after the moving line */
    nextPoint: Point;
    isHorizontal: boolean;
}
interface DraggableBaseContainerProps {
    style: CroppingViewPolygonHandleStyle;
    containerSize: Size;
    scale: number;
    rotations: number;
    points: Point[];
    cornerMoveStart?: (data: {
        index: number;
        point: Point;
    }) => void;
    cornerMoved?: (data: {
        index: number;
        point: Point;
    }) => void;
    cornerMoveEnd?: any;
    lineMoved?: (movingLine: MovingLine) => void;
}
export declare class DraggableBaseContainer extends React.Component<DraggableBaseContainerProps, any> {
    POINT_COUNT: number;
    get pointSize(): number;
    get pointStyle(): CSSProperties;
    items: HTMLDivElement[];
    parentOffset: Point;
    nextIndex(index: number): number;
    previousIndex(index: number): number;
    isHorizontal(index: number): boolean;
    DRAG_BUFFER: number;
    isOutOfBounds(coordinate: number, bound: number): boolean;
    get invisibleHandleStyle(): CSSProperties;
}
export {};
