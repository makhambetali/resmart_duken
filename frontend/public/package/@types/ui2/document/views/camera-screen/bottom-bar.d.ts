import React from "react";
import { CroppedDetectionResult } from "../../../../core/worker/ScanbotSDK.Core";
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
import { ShutterButtonState } from "./shutter-button";
import type ScanbotSDK from "../../../../scanbot-sdk";
export declare class ButtonBarState {
    importButtonEnabled: boolean;
    snappingModeButtonEnabled: boolean;
    snappingModeState: "auto" | "manual";
    torchButtonEnabled: boolean;
    torchState: "on" | "off";
    reviewButtonCount: number;
    reviewButtonPreviewImageUrl: string | null;
    reviewButtonEnabled: boolean;
    shutterButtonState: ShutterButtonState;
}
declare class Props {
    config: DocumentScanningFlow;
    onFileSelectDialogOpened: () => void;
    /** Note that onFileSelectDialogClosed may not be called in old browsers (see details below). */
    onFileSelectDialogClosed: () => void;
    onFileUploaded: (image: Promise<CroppedDetectionResult | null>) => void;
    snappingModeButtonClick: () => void;
    onTorchButtonClick: () => void;
    onReviewButtonClick: () => void;
    onShutterButtonClick: () => void;
    buttonStates: ButtonBarState;
    sdk: ScanbotSDK;
    scanLimitReached: boolean;
}
export declare const Height = 112;
export declare function BottomBar(props: Props): React.JSX.Element;
export {};
