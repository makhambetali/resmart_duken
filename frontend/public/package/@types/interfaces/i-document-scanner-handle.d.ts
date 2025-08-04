import { IScannerCommon } from "./i-scanner-common-handle";
import type { CroppedDetectionResult } from "../core-types";
export interface IDocumentScannerHandle extends IScannerCommon {
    detectAndCrop(): Promise<CroppedDetectionResult>;
    enableAutoCapture(): void;
    disableAutoCapture(): void;
    isAutoCaptureEnabled(): boolean;
}
