import React from "react";
import DocumentPolygon from "./document-polygon";
import AnimatedPath from "./animated-path";
import { ShutterButtonAction } from "../shutter-button";
import { CaptureAnimationStyleConfiguration, OutlinePolygonStyleConfiguration } from "../../model/configuration/document-scanner-view-configuration";
export declare class AnimatedDocumentPolygonProps {
    action?: ShutterButtonAction;
    autoCaptureSensitivity?: number;
    style?: any;
    isOk?: boolean;
    isVisible?: boolean;
    polygonStyle?: OutlinePolygonStyleConfiguration;
    pathStyle?: CaptureAnimationStyleConfiguration;
}
export default class AnimatedDocumentPolygon extends React.Component<AnimatedDocumentPolygonProps, any> {
    polygon: DocumentPolygon;
    previous: any[];
    path: AnimatedPath;
    render(): React.JSX.Element;
    update(points: any[], isOk: boolean, action: ShutterButtonAction): void;
    animateCapturing(): void;
    clearAnimation(): void;
}
