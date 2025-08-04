import { CameraInfo } from "../model/camera-info";
export interface IScannerCommon {
    swapCameraFacing(force?: boolean): void;
    switchCamera(deviceId: string, mirrored?: boolean): void;
    fetchAvailableCameras(): Promise<CameraInfo[]>;
    getActiveCameraInfo(): CameraInfo | undefined;
    setTorchState(state: boolean): Promise<void>;
    dispose(): void;
}
