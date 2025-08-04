export type CameraFacingMode = 'front' | 'back' | 'unknown';
export interface CameraInfo {
    deviceId: string;
    label: string;
    maxNumPixels: number | undefined;
    supportsTorchControl: boolean | undefined;
    facingMode: CameraFacingMode;
}
