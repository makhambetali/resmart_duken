import type { VideoToImageData } from "./video-to-image-data";
/**
 * Extracts single video frames as ImageData objects.
 * Supports cropping and scaling.
 **/
export declare class WebGLVideoToImageData implements VideoToImageData {
    _type: string;
    private readonly canvas;
    private readonly gl;
    private readonly program;
    static isSupported(): boolean;
    /**
     * While WebGL easily allows us to read a video into a texture, there are no ready-to-use methods for
     * scaling and cropping the texture to our desired size.
     * Therefore, we write a custom shader that does this for us. It works by mapping the desired part of the texture
     * onto a screen-filling quad.
     * Adapted from https://stackoverflow.com/questions/52507592/how-to-scale-a-texture-in-webgl
     */
    constructor();
    getImageData(source: HTMLVideoElement | HTMLCanvasElement, sourceCropOffsetX: number, sourceCropOffsetY: number, sourceCropWidth: number, sourceCropHeight: number, targetWidth: number, targetHeight: number, reuseBufferIfPossible: Uint8ClampedArray | null): ImageData;
}
