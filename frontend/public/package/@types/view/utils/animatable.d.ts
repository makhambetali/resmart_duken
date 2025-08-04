import React from "react";
import { Size } from "../../utils/dto/Size";
import { Point } from "../../utils/dto/Point";
interface AnimatableProps {
    size: Size;
    imageMargin: Point;
    rotations: number;
    scale: number;
    duration: number;
    children?: React.ReactNode;
}
export declare class Animatable extends React.Component<AnimatableProps, any> {
    previousScale: number;
    container: HTMLDivElement;
    width(): number;
    height(): number;
    private animating;
    isAnimating(): boolean;
    render(): React.JSX.Element;
    marginWithAspect(margin: Point, axis: "x" | "y", size: Size): number;
    calculate(size: Size, property: "width" | "height"): any;
}
export {};
