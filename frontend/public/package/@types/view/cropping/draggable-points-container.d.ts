import React from "react";
import { DraggableBaseContainer } from "./draggable-base-container";
export declare class DraggablePointsContainer extends DraggableBaseContainer {
    create(): React.JSX.Element[];
    cornerTouchStart(e: React.PointerEvent<HTMLDivElement>, index: number): void;
    cornerTouchMove(e: React.PointerEvent<HTMLDivElement>, index: number): void;
    cornerTouchEnd(e: React.PointerEvent<HTMLDivElement>): void;
    render(): React.JSX.Element;
}
