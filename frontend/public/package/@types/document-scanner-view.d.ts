import React from "react";
import type ScanbotSDK from './scanbot-sdk';
import { DocumentScannerViewConfiguration, HintTextConfiguration } from "./model/configuration/document-scanner-view-configuration";
import { ScanbotCameraProps, ScanbotCameraState, ScannerView } from "./scanner-view";
import { ShutterButton, ShutterButtonAction } from "./view/shutter-button";
import { DocumentOutline } from "./view/document-outline";
import { PolygonMovementPredicate } from "./utils/predicate/polygon-movement-predicate";
import { Polygon } from "./utils/dto/Polygon";
import { IDocumentScannerHandle } from "./interfaces/i-document-scanner-handle";
import { CroppedDetectionResult, DocumentDetectionResult, ObjectId } from "./core-types";
import { ViewFinderPadding } from "./view/view-finder";
export declare class DocumentScannerState extends ScanbotCameraState {
    action: ShutterButtonAction;
}
export declare class DocumentScannerProps extends ScanbotCameraProps {
    sdk: ScanbotSDK;
    hideShutterButton?: boolean;
    onStatusStringUpdate?: (status: keyof HintTextConfiguration) => void;
    viewFinderPadding?: ViewFinderPadding;
    pauseAR?: boolean;
}
export default class DocumentScannerView extends ScannerView<DocumentScannerProps, DocumentScannerState> implements IDocumentScannerHandle {
    static DETECT_AND_CROP_RESOLUTION: number;
    outline: DocumentOutline | null;
    button: ShutterButton | null;
    polygonMovementPredicate: PolygonMovementPredicate;
    autoCaptureToken: any;
    private _configuration?;
    private finder?;
    constructor(props: DocumentScannerProps);
    get defaultAction(): ShutterButtonAction;
    get enabled(): boolean;
    get configuration(): DocumentScannerViewConfiguration;
    componentDidUpdate(prevProps: DocumentScannerProps): void;
    get autoCaptureSensitivity(): number;
    /**
     * Public API functions
     */
    static create(configuration: DocumentScannerViewConfiguration, sdk: ScanbotSDK): Promise<DocumentScannerView>;
    detectAndCrop(): Promise<CroppedDetectionResult | null>;
    enableAutoCapture(): void;
    disableAutoCapture(): void;
    updateAutoCapture(enabled: boolean): void;
    isAutoCaptureEnabled(): boolean;
    scannerToken: Promise<ObjectId<"DocumentScanner">>;
    /**
     * Internal functions
     */
    componentDidMount(): Promise<void>;
    componentWillUnmount(): Promise<void>;
    detect(): Promise<void>;
    getStatusString(detectionResult: DocumentDetectionResult): import("./core-types").DocumentDetectionStatus;
    detectInWebWorker(): Promise<DocumentDetectionResult & {
        originalImage: ImageData;
    }>;
    preventAutoCapture?: boolean;
    handleAutoCapture(statusOk: boolean, polygon?: Polygon): Promise<void>;
    updateButton(action: ShutterButtonAction): void;
    render(): React.JSX.Element;
    defaultCaptureButtonClick: () => Promise<void>;
    private scalePolygonPointsToPixels;
    private runMovementPredicate;
    private getCameraFrameSize;
}
