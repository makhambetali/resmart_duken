import { PointerEvent } from "react";
import { Point } from "../../../../../utils/dto/Point";
export type FlingDirection = "none" | "up" | "down" | "left" | "right";
export declare class DragProps {
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (e: PointerEvent<HTMLDivElement>) => void;
}
export declare class TouchEvent {
    x: number;
    y: number;
    time: number;
}
export declare function useDragListener(onMove: (point: Point) => void, onEnd: (point: Point, fling?: FlingDirection) => void, onCancel: () => void): {
    startPoint: import("react").MutableRefObject<Point>;
    currentPoint: Point;
    props: {
        onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
        onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
        onPointerUp: (e: PointerEvent<HTMLDivElement>) => void;
        onPointerCancel: (e: PointerEvent<HTMLDivElement>) => void;
    };
    stop: () => void;
    dragOngoing: boolean;
};
