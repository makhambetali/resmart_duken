import React from "react";
import VideoStream from "../utils/video-stream";
import { Size } from "../utils/dto/Size";
import { Frame } from "../utils/dto/Frame";
import { CameraInfo } from "../model/camera-info";
import { ScannerConfiguration } from "../model/configuration/scanner-configuration";
import { VideoToImageData } from "../utils/video-to-image-data/video-to-image-data";
export interface ScanbotCameraViewProps {
    configuration?: ScannerConfiguration;
    videoConstraints: MediaTrackConstraints;
    mirrored: boolean;
    onReady: () => void;
    onError: (err: Error) => void;
    preferredCamera?: string;
    zoom?: number;
}
export interface ScanbotCameraViewState {
    facingModeBack: boolean;
    mirrored: boolean;
    deviceId: string;
}
export default class ScanbotCameraView extends React.Component<ScanbotCameraViewProps, ScanbotCameraViewState> {
    video: HTMLVideoElement | null;
    videoStream: VideoStream | null;
    canvas: VideoToImageData | null;
    videoLoaded: boolean;
    reloadCanvas: boolean;
    swapCameraEnabled: boolean;
    private activeCamera;
    didLoadVideo: any;
    finderFrame: Frame;
    constructor(props: any);
    videoSize(): {
        width: number;
        height: number;
    };
    save: boolean;
    saveExtractedData(): void;
    zoom(): number;
    private capture?;
    private imageCapture;
    private _reusableImageBuffer;
    /**
     * If set and the provided buffer has the correct size, `createImageData` will write the ImageData into this buffer.
     *  Otherwise, `createImageData` will create a new Buffer.
     **/
    set reusableImageBuffer(buffer: Uint8ClampedArray);
    createImageData(maxLargerLength?: number, useImageCaptureAPI?: boolean): Promise<ImageData>;
    windowSize(): Frame;
    /**
     * The max size of the video frame that will be extracted from the video stream.
     * e.g. the DOMRect of the container is 390x844, and the video is 1920x1080,
     * scales 390x844 up to 499x1080, as that's the max size that fits into the video.
     */
    calculateClientVideoConstraints(): {
        clientVideoWidth: number;
        clientVideoHeight: number;
        coef: number;
    };
    calculateFrameSize(maxLargerLength: number, videoWidth: number, videoHeight: number): Size;
    getCanvasRenderingContext(): VideoToImageData;
    releaseCanvas(): void;
    componentWillUnmount(): void;
    onStreamChanged: (stream: MediaStream) => void;
    style(): React.CSSProperties;
    zoomMargin(): number;
    render(): React.JSX.Element;
    setDirection(direction: "environment" | "user"): void;
    swapCameraFacing(force?: boolean): void;
    switchCamera(deviceId: string, mirrored?: boolean): Promise<void>;
    private updateCameraInfo;
    getActiveCameraInfo(): CameraInfo | undefined;
    setTorchState(enabled: boolean): Promise<void>;
}
