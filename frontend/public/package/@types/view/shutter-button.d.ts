import React from "react";
import "../styles/shutter.css";
export type ShutterButtonAction = "manual" | "searching" | "capturing" | "processing";
export declare class ShutterButtonProps {
    color: string;
    action: ShutterButtonAction;
    onClick: any;
    style?: any;
}
export declare class ShutterButton extends React.Component<ShutterButtonProps, {}> {
    private inner1;
    private inner2;
    render(): React.JSX.Element;
    updateAnimationSpeed(action: ShutterButtonAction): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    captureBackground(): React.JSX.Element;
    captureInnerCircle(): React.JSX.Element;
    captureSearchingInner1(): React.JSX.Element;
    captureSearchingInner2(): React.JSX.Element;
    path(definition: string): React.JSX.Element;
    svgBase(classes: {
        [key: string]: boolean;
    }, child: any, ref?: (ref: any) => void): React.JSX.Element;
}
