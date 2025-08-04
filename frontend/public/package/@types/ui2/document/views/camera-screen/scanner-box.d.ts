import React, { ReactElement } from "react";
import type ScanbotSDK from "../../../../scanbot-sdk";
import DocumentScannerView from "../../../../document-scanner-view";
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
import { UserGuidanceTextKey } from "./user-guidance-text";
import { SnappingMode } from "../../controller/camera-screen-controller";
declare class Props {
    config: DocumentScanningFlow;
    sdk: ScanbotSDK;
    documentScannerView: ReactElement<typeof DocumentScannerView>;
    showHand: boolean;
    userGuidanceText: UserGuidanceTextKey;
    snappingMode: SnappingMode;
    bottomUserGuidanceVisible: boolean;
    showCameraBlink: boolean;
}
export declare const BottomUserGuidanceHeight = 56;
export declare const CameraBlinkDuration = "0.5s";
/** Composes the scanner view with all the UI elements that are displayed on top of it. */
export declare function ScannerBox(props: Props): React.JSX.Element;
export {};
