import { ScannerConfiguration } from "./scanner-configuration";
import { CroppedDetectionResult, DocumentDetectionStatus, DocumentScannerParameters } from "../../core-types";
import type { ViewFinderConfiguration } from "../../ui2/configuration";
import type { DeepPartial } from "../../ui2/configuration/utils";
export type EnabledText = {
    enabled?: boolean;
    value: string;
};
export declare class TextConfiguration {
    constructor(hint?: HintTextConfiguration);
    hint?: HintTextConfiguration;
    initializing?: EnabledText;
}
export type HintTextConfiguration = {
    [key in DocumentDetectionStatus]?: string;
};
export declare class StyleConfiguration {
    constructor();
    outline?: OutlineStyleConfiguration;
    captureButton?: CaptureButtonStyleConfiguration;
}
export declare class OutlineStyleConfiguration {
    constructor();
    polygon?: OutlinePolygonStyleConfiguration;
    path?: CaptureAnimationStyleConfiguration;
    label?: OutlineLabelStyleConfiguration;
}
export declare class OutlinePolygonStyleConfiguration {
    strokeCapturing?: string;
    strokeSearching?: string;
    fillCapturing?: string;
    fillSearching?: string;
    strokeWidthCapturing?: number;
    strokeWidthSearching?: number;
}
export declare class CaptureAnimationStyleConfiguration {
    stroke?: string;
    strokeWidth?: number;
}
export declare class OutlineLabelStyleConfiguration {
    position?: any;
    top?: any;
    left?: any;
    transform?: any;
    textAlign?: any;
    backgroundColor?: any;
    color?: any;
    borderRadius?: any;
    padding?: any;
    fontFamily?: any;
    fontSize?: any;
}
export declare class CaptureButtonStyleConfiguration {
    color?: string;
}
export declare class DocumentScannerViewConfiguration extends ScannerConfiguration {
    constructor();
    /** {@displayType `DeepPartial<DocumentScannerParameters>`} {@link DocumentScannerParameters}*/
    detectionParameters?: DeepPartial<DocumentScannerParameters>;
    /**
     * If auto-capture is enabled and when a document is detected, it will be automatically
     * captured when conditions are good and the auto-snapping time-out elapses.
     */
    autoCaptureEnabled?: boolean;
    /**
     * Controls the auto-capture speed. Sensitivity must be within the 0..1 range.
     * A value of 1.0 triggers automatic capturing immediately,
     * a value of 0.0 delays the automatic by 3 seconds. The default value is 0.66 (2 seconds)
     */
    autoCaptureSensitivity?: number;
    /**
     * Delay in milliseconds before the auto-capture is triggered after 'onDocumentDetected' has been called.
     * This delay is used to prevent too many documents being captured in a row.
     * In essence, autoCaptureSensitivity controls the speed of autocapture during the detection phase,
     * while autoCaptureDelay controls the speed of autocapture after the detection phase.
     * Default is 1000ms.
     */
    autoCaptureDelay?: number;
    /**
     * Determines whether to ignore the OK_BUT_BAD_ASPECT_RATIO detection status.
     * By default BadAspectRatio is not ignored.
     */
    ignoreBadAspectRatio?: boolean;
    /**
     * Attempts to take a single exposure using the video capture device,
     * resulting in a high resolution image and potentially greatly improved detection quality.
     * Relies on the experimental ImageCapture API that: https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture.
     * Use with caution. At the time of writing this, reliably only works on Android devices with Google Chrome.
     * If enabled, this only affects extraction after the document outline has been identified.
     * This may also trigger your device's default "snap" animation, making scanbotSDK.utils.flash(); irrelevant
     * Defaults to false.
     */
    useImageCaptureAPI?: boolean;
    text?: TextConfiguration;
    style?: StyleConfiguration;
    finder?: DeepPartial<ViewFinderConfiguration>;
    /**
     * By default, capture button invokes 'onDocumentDetected' callback, if you want custom behavior,
     * you can optionally override this button
     */
    onCaptureButtonClick?: (e: any) => void;
    /**
     * Document detected callback. Continuous callback,
     * stopped only when detection is stopped or camera widget is disposed.
     */
    onDocumentDetected?: (result: CroppedDetectionResult) => void;
    static fromJson(json: any): DocumentScannerViewConfiguration;
}
