import type { VideoToImageData } from "./video-to-image-data";
export declare class TwoDVideoToImageData implements VideoToImageData {
    _type: string;
    private readonly canvas;
    private readonly ctx;
    constructor();
    getImageData(source: HTMLVideoElement | HTMLCanvasElement, sourceCropOffsetX: number, sourceCropOffsetY: number, sourceCropWidth: number, sourceCropHeight: number, targetWidth: number, targetHeight: number, reuseBufferIfPossible: Uint8ClampedArray | null): ImageData;
}
