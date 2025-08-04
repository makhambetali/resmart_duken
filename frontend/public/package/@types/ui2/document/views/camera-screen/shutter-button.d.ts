import { ShutterButton as ShutterButtonConfig } from "../../../configuration/document/CameraScreenConfiguration";
import React from "react";
export type ShutterButtonState = 'auto' | 'loading' | 'manual';
declare class Props {
    state: ShutterButtonState;
    onClick: () => void;
    config: ShutterButtonConfig;
}
export declare function ShutterButton(props: Props): React.JSX.Element;
export {};
