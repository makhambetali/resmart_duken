import { IScannerCommon } from "./i-scanner-common-handle";
export interface IMrzScannerHandle extends IScannerCommon {
    resumeDetection(): void;
    pauseDetection(): void;
    isDetectionPaused(): boolean;
}
