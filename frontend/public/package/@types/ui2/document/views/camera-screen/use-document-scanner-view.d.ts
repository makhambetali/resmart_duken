import React from "react";
import DocumentScannerView from "../../../../document-scanner-view";
import type ScanbotSDK from "../../../../scanbot-sdk";
import { HintTextConfiguration } from "../../../../model/configuration/document-scanner-view-configuration";
import { CroppedDetectionResult } from "../../../../core/worker/ScanbotSDK.Core";
import { DocumentScanningFlow } from "../../../configuration/document/DocumentScanningFlow";
import { SnappingMode } from "../../controller/camera-screen-controller";
import type { ViewFinderPadding } from "../../../../view/view-finder";
import { CameraInfo } from "../../../../model/camera-info";
declare class Props {
    sdk: ScanbotSDK;
    configuration: DocumentScanningFlow;
    onImageCaptured: (image: CroppedDetectionResult) => void;
    onUserGuidanceTextUpdate: (text: keyof HintTextConfiguration) => void;
    onError: (error: any) => void;
    snappingMode: SnappingMode;
    scanningPaused: boolean;
    torchEnabled: boolean;
    viewFinderPadding: ViewFinderPadding;
    pauseAR: boolean;
}
export declare function useDocumentScannerView(props: Props): {
    documentScannerView: React.ReactElement<typeof DocumentScannerView>;
    documentScannerViewRef: React.RefObject<DocumentScannerView>;
    torchSupported: boolean;
    scannerInitialized: boolean;
    availableCameras: CameraInfo[];
    activeCamera: CameraInfo | null;
    setActiveCamera: (camera: CameraInfo) => Promise<void>;
};
export {};
