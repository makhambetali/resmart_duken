import React from "react";
import { Point } from "../../utils/dto/Point";
import { CaptureAnimationStyleConfiguration } from "../../model/configuration/document-scanner-view-configuration";
export declare class AnimatedPathProps {
    duration: number;
    style?: CaptureAnimationStyleConfiguration;
}
export default class AnimatedPath extends React.Component<AnimatedPathProps, any> {
    constructor(props: any);
    render(): React.ReactNode;
    animate(points: Point[]): void;
    clear(): void;
}
