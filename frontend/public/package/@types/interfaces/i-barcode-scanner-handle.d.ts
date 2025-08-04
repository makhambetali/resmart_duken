import { Size } from "../utils/dto/Size";
import { IScannerCommon } from "./i-scanner-common-handle";
export interface IBarcodeScannerHandle extends IScannerCommon {
    saveExtractedImageData(): void;
    resumeDetection(): void;
    pauseDetection(): void;
    isDetectionPaused(): boolean;
    getCapabilities(): MediaTrackCapabilities | undefined;
    setZoom(zoom: number): void;
    setFinderVisible(isVisible: boolean): void;
    updateTorch(enabled: boolean): void;
    getResolution(): Promise<Size>;
    setRecognitionResolution(resolution: number): void;
}
