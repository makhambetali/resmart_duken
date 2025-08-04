import React from "react";
import { Point } from "../../utils/dto/Point";
import { Size } from "../../utils/dto/Size";
import { CroppingViewMagnifierStyle } from "../../model/configuration/cropping-view-configuration";
export declare class MagnifierSourceImage {
    element: HTMLImageElement;
    size: Size;
    constructor(element: HTMLImageElement, size: Size);
}
export declare class MagnifierOptions {
    source: MagnifierSourceImage;
    origin: Point;
    rotations: number;
    scale: number;
    container: Size;
}
export declare class MagnifierCrosshair extends React.Component<any, any> {
    render(): React.JSX.Element;
    half(): number;
    vertical(): React.JSX.Element;
    horizontal(): React.JSX.Element;
}
export declare class MagnifierViewProps {
    src?: string;
    style?: CroppingViewMagnifierStyle;
}
export default class MagnifierView extends React.Component<MagnifierViewProps, any> {
    destination: HTMLImageElement;
    get crosshairSize(): number;
    constructor(props: any);
    style(): {
        container: React.CSSProperties;
        image: React.CSSProperties;
        crosshair: React.CSSProperties;
    };
    render(): React.JSX.Element;
    update(options: MagnifierOptions): void;
    isPointTopLeft(point: Point, source: Size, rotations: number): boolean;
    setIsVisible(visible: boolean, callback?: any): void;
    MAX_ROTATIONS: number;
    normalizeRotations(input: number): number;
}
