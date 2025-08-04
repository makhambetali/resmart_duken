import { IScannerCommon } from "./i-scanner-common-handle";
export interface ITextPatternScannerHandle extends IScannerCommon {
    resumeDetection(): void;
    pauseDetection(): void;
    isDetectionPaused(): boolean;
}
