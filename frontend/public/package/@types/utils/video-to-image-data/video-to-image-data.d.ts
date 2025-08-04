export interface VideoToImageData {
    getImageData(source: HTMLVideoElement | HTMLCanvasElement, sourceCropOffsetX: number, sourceCropOffsetY: number, sourceCropWidth: number, sourceCropHeight: number, targetWidth: number, targetHeight: number, reuseBufferIfPossible: Uint8ClampedArray | null): ImageData;
    _type: string;
}
export declare function createVideoToImageData(): VideoToImageData;
