import React from "react";
import BarcodeScannerView from "../../../../barcode-scanner-view";
import type { ActionBarConfiguration } from "../../../configuration/common/ActionBarConfiguration";
import type { CameraModule } from "../../../configuration/common/CameraConfiguration";
export type Facingmode = "environment" | "user";
export declare class Props {
    capabilities?: ActionButtonCapabilities;
    scanner?: BarcodeScannerView;
    /** Action buttons will be positioned at the bottom of the video, with this padding. */
    bottomPadding: number;
    config: ActionBarConfiguration;
    torchEnabledInitially: boolean;
    initialCameraModule: CameraModule;
    zoomSteps: number[];
    defaultZoomFactor: number;
}
export declare class ActionButtonCapabilities {
    hasFacingOptions: boolean;
    isTorchAvailable: boolean;
    static setFromScanner(scanner: React.MutableRefObject<BarcodeScannerView>, setCapabilities: React.Dispatch<React.SetStateAction<ActionButtonCapabilities>>): void;
}
export declare function areAnyActionButtonsVisible(capabilities: ActionButtonCapabilities | undefined, actionBarConfiguration: ActionBarConfiguration): boolean;
export default function ActionButtonContainer(props: Props): React.JSX.Element;
