import React from "react";
import { MagneticLine } from "../../utils/dto/MagneticLine";
import { Point } from "../../utils/dto/Point";
import type { CroppingViewMagneticLineStyle } from "../../model/configuration/cropping-view-configuration";
import type { MovingLine } from "./draggable-base-container";
interface MagneticLinesComponentProps {
    lines: {
        horizontal: {
            scaled: MagneticLine[];
        };
        vertical: {
            scaled: MagneticLine[];
        };
    };
    movingLine: MovingLine;
    snapTo: (data: {
        magneticLine: MagneticLine;
        polygonLine: MovingLine;
    }) => void;
    style: CroppingViewMagneticLineStyle;
}
export declare class MagneticLinesComponent extends React.Component<MagneticLinesComponentProps, any> {
    fromPoint(point: MagneticLine): React.JSX.Element;
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
    render(): React.JSX.Element;
    BUFFER: number;
    snapToClosestIfAnyAreClose(): void;
    distanceToLine(line: MagneticLine, x: Point): number;
    midPoint(point1: Point, point2: Point): Point;
}
export {};
